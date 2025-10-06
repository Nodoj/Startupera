"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { UserWithRole } from '@/lib/utils/rbac';

export function useUser() {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    // Get initial user
    const getUser = async () => {
      try {
        // Try getSession first
        let { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // If no session, try refreshing (needed for SSR cookie handling)
        if (!session && !sessionError) {
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
          session = refreshedSession;
        }
        
        if (!session?.user) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        
        const authUser = session.user;

        // Get user profile with role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name, company')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          const userData = {
            id: authUser.id,
            email: authUser.email!,
            role: profile.role,
            full_name: profile.full_name,
            company: profile.company,
          };
          if (mounted) {
            setUser(userData);
          }
        } else {
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getUser();
    
    return () => {
      mounted = false;
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, full_name, company')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: profile.role,
            full_name: profile.full_name,
            company: profile.company,
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
