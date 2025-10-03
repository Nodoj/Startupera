'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteFlow } from '@/lib/actions/flows'
import { Trash2, Loader2 } from 'lucide-react'
import { adminTheme } from '@/styles/admin-theme'

interface DeleteFlowButtonProps {
  flowId: string
  flowTitle: string
}

export default function DeleteFlowButton({ flowId, flowTitle }: DeleteFlowButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteFlow(flowId)
      router.refresh()
    } catch (error) {
      console.error('Error deleting flow:', error)
      alert('Failed to delete flow. Please try again.')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`${adminTheme.card.base} ${adminTheme.card.padding.lg} max-w-md w-full mx-4`}>
          <h3 className={`${adminTheme.typography.h3} mb-2`}>Delete Flow?</h3>
          <p className={`${adminTheme.typography.body} mb-6`}>
            Are you sure you want to delete <strong>{flowTitle}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className={adminTheme.button.secondary}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`${adminTheme.button.danger} inline-flex items-center`}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
      title="Delete flow"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
