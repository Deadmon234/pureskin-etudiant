"use client";

import { Clock, Sun, Coffee, Moon, X, Download, Share2 } from "lucide-react";
import { Routine as RoutineType } from "@/lib/api";

interface RoutineStepsModalProps {
  routine: RoutineType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoutineStepsModal({ routine, isOpen, onClose }: RoutineStepsModalProps) {
  if (!isOpen || !routine) return null;

  const steps = routine.steps ? routine.steps.split('\n').filter(step => step.trim()) : [];
  const products = routine.productsNeeded ? routine.productsNeeded.split('\n').filter(product => product.trim()) : [];

  const handleDownload = () => {
    // Créer le contenu du PDF
    const content = `
Routine PureSkin - ${routine.name}
====================================

Description:
${routine.description}

Durée: ${routine.durationMinutes} minutes
Niveau: ${routine.difficultyLevel}
Type de peau: ${routine.skinTypeId || 'Tous types'}

ÉTAPES DE LA ROUTINE:
${steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}

PRODUITS RECOMMANDÉS:
${products.map(product => `• ${product}`).join('\n')}

CONSEILS:
${routine.skinConcerns || 'Appliquer les produits par mouvements doux et circulaires.'}

---
Généré par PureSkin Étudiant - ${new Date().toLocaleDateString()}
    `.trim();

    // Créer un blob et télécharger
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routine-pureskin-${routine.slug}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Routine PureSkin - ${routine.name}`,
          text: `Découvrez ma routine de ${routine.durationMinutes} minutes : ${routine.description}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copier dans le presse-papiers
      const text = `Routine PureSkin - ${routine.name}\n${routine.description}\nDécouvrez plus sur ${window.location.href}`;
      await navigator.clipboard.writeText(text);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{routine.name}</h2>
                <div className="flex items-center space-x-4 text-green-50">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{routine.durationMinutes} min</span>
                  </div>
                  <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm">
                    {routine.difficultyLevel}
                  </span>
                  {routine.isRecommended && (
                    <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-medium">
                      ⭐ Recommandé
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-700">{routine.description}</p>
              {routine.skinTypeId && (
                <div className="mt-2">
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    Type de peau: {routine.skinTypeId}
                  </span>
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                Étapes de la routine
              </h3>
              <div className="space-y-3">
                {steps.length > 0 ? (
                  steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-700">{step}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Les étapes détaillées seront bientôt disponibles.</p>
                )}
              </div>
            </div>

            {/* Products */}
            {products.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                    🧴
                  </span>
                  Produits recommandés
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.map((product, index) => (
                    <div key={index} className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{product}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {routine.skinConcerns && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center mr-3 text-sm">
                    💡
                  </span>
                  Conseils
                </h3>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <p className="text-gray-700">{routine.skinConcerns}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                style={{ cursor: 'pointer' }}
              >
                <Download className="w-5 h-5" />
                <span>Télécharger la routine</span>
              </button>
              <button
                onClick={handleShare}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 font-medium"
                style={{ cursor: 'pointer' }}
              >
                <Share2 className="w-5 h-5" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
