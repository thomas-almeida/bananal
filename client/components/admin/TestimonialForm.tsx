'use client'

import { useState } from 'react'

interface Testimonial {
  _id: string
  authorName: string
  authorImage: string
  text: string
  approved: boolean
  createdAt: string
}

interface TestimonialFormProps {
  testimonials: Testimonial[]
  onApprove: (id: string, approved: boolean) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function TestimonialForm({ testimonials, onApprove, onDelete }: TestimonialFormProps) {
  return (
    <div className="space-y-4">
      {testimonials.length === 0 && (
        <p className="text-gray-500 text-center py-4">Nenhum depoimento ainda.</p>
      )}

      {testimonials.map(item => (
        <div key={item._id} className={`p-4 border rounded-lg ${!item.approved ? 'border-yellow-300 bg-yellow-50' : ''}`}>
          <div className="flex items-start gap-3">
            {item.authorImage && (
              <img src={item.authorImage} alt={item.authorName} className="w-10 h-10 rounded-full object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{item.authorName}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${item.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.approved ? 'Aprovado' : 'Pendente'}
                </span>
              </div>
              <p className="text-sm text-gray-600 italic">"{item.text}"</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3 pt-3 border-t">
            {!item.approved && (
              <button
                onClick={() => onApprove(item._id, true)}
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                Aprovar
              </button>
            )}
            {item.approved && (
              <button
                onClick={() => onApprove(item._id, false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Reprovar
              </button>
            )}
            <button
              onClick={() => onDelete(item._id)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
