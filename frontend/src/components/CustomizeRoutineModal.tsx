"use client";

import { useState } from "react";
import { X, Check, Clock, Target, Sparkles, Calendar, User } from "lucide-react";

interface CustomizeRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CustomizeRoutineModal({ isOpen, onClose }: CustomizeRoutineModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skinType: '',
    skinConcerns: '',
    availableTime: '',
    routineFrequency: '',
    budget: '',
    preferences: [] as string[]
  });

  const skinTypes = [
    { id: 'normal', label: 'Normale', icon: '✨' },
    { id: 'dry', label: 'Sèche', icon: '🌵' },
    { id: 'oily', label: 'Grasse', icon: '💧' },
    { id: 'combination', label: 'Mixte', icon: '🎭' },
    { id: 'sensitive', label: 'Sensible', icon: '🌸' }
  ];

  const concerns = [
    'Acné/Boutons',
    'Points noirs',
    'Peau terne',
    'Ridules fines',
    'Tâches pigmentaires',
    'Sécheresse',
    'Sensibilité',
    'Pores dilatés'
  ];

  const timeOptions = [
    { id: '5', label: '5 min (Ultra-rapide)', icon: '⚡' },
    { id: '10', label: '10 min (Express)', icon: '🚀' },
    { id: '15', label: '15 min (Standard)', icon: '⏰' },
    { id: '20+', label: '20+ min (Complète)', icon: '🌟' }
  ];

  const frequencies = [
    { id: 'daily', label: 'Quotidienne' },
    { id: '5days', label: '5 jours/semaine' },
    { id: '3days', label: '3 jours/semaine' },
    { id: 'weekend', label: 'Week-end uniquement' }
  ];

  const budgets = [
    { id: 'low', label: 'Moins de 20€', range: '5-20€' },
    { id: 'medium', label: '20-50€', range: '20-50€' },
    { id: 'high', label: '50-100€', range: '50-100€' },
    { id: 'premium', label: '100€+', range: '100€+' }
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Simuler la génération de routine personnalisée
    const routineData = {
      ...formData,
      createdAt: new Date().toISOString()
    };
    
    // Sauvegarder dans localStorage
    localStorage.setItem('custom-routine', JSON.stringify(routineData));
    
    // Afficher un message de succès
    alert('🎉 Routine personnalisée générée avec succès ! Vous recevrez vos recommandations par email.');
    
    onClose();
  };

  const togglePreference = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(concern)
        ? prev.preferences.filter(p => p !== concern)
        : [...prev.preferences, concern]
    }));
  };

  if (!isOpen) return null;

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
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Personnaliser ma routine</h2>
                <p className="text-purple-100">
                  Créez une routine sur mesure adaptée à votre mode de vie étudiant
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-100">Étape {step} sur 5</span>
                <span className="text-sm text-purple-100">{step * 20}%</span>
              </div>
              <div className="w-full bg-purple-400 bg-opacity-30 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${step * 20}%` }}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
            {/* Step 1: Skin Type */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quel est votre type de peau ?
                  </h3>
                  <p className="text-gray-600">
                    Sélectionnez l'option qui correspond le mieux à votre peau
                  </p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {skinTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, skinType: type.id }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.skinType === type.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-medium text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Skin Concerns */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quelles sont vos préoccupations ?
                  </h3>
                  <p className="text-gray-600">
                    Sélectionnez toutes les options qui s'appliquent (plusieurs choix possibles)
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {concerns.map((concern) => (
                    <button
                      key={concern}
                      onClick={() => togglePreference(concern)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        formData.preferences.includes(concern)
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          formData.preferences.includes(concern)
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.preferences.includes(concern) && (
                            <Check className="w-2 h-2 text-white m-auto" />
                          )}
                        </div>
                        <span className="text-sm font-medium">{concern}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Available Time */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Combien de temps avez-vous ?
                  </h3>
                  <p className="text-gray-600">
                    Soyez réaliste avec votre emploi du temps d'étudiant
                  </p>
                </div>
                
                <div className="space-y-3">
                  {timeOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setFormData(prev => ({ ...prev, availableTime: option.id }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.availableTime === option.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.availableTime === option.id
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.availableTime === option.id && (
                            <Check className="w-3 h-3 text-white m-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Frequency */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    À quelle fréquence ?
                  </h3>
                  <p className="text-gray-600">
                    Quelle fréquence réaliste pour vous ?
                  </p>
                </div>
                
                <div className="space-y-3">
                  {frequencies.map((freq) => (
                    <button
                      key={freq.id}
                      onClick={() => setFormData(prev => ({ ...prev, routineFrequency: freq.id }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.routineFrequency === freq.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{freq.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.routineFrequency === freq.id
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.routineFrequency === freq.id && (
                            <Check className="w-3 h-3 text-white m-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Budget */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Quel budget ?
                  </h3>
                  <p className="text-gray-600">
                    Pour l'ensemble des produits de votre routine
                  </p>
                </div>
                
                <div className="space-y-3">
                  {budgets.map((budget) => (
                    <button
                      key={budget.id}
                      onClick={() => setFormData(prev => ({ ...prev, budget: budget.id }))}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        formData.budget === budget.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{budget.label}</div>
                          <div className="text-sm text-gray-500">{budget.range}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          formData.budget === budget.id
                            ? 'bg-purple-500 border-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {formData.budget === budget.id && (
                            <Check className="w-3 h-3 text-white m-auto" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t mt-8">
              <button
                onClick={handlePrevious}
                disabled={step === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  step === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                style={{ cursor: step === 1 ? 'not-allowed' : 'pointer' }}
              >
                Précédent
              </button>
              
              {step < 5 ? (
                <button
                  onClick={handleNext}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  Suivant
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center space-x-2"
                  style={{ cursor: 'pointer' }}
                >
                  <Check className="w-5 h-5" />
                  <span>Générer ma routine</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
