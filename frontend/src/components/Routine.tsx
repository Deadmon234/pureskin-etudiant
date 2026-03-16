"use client";

import { useEffect, useState } from "react";
import { apiService, Routine as RoutineType } from "@/lib/api";
import { Clock, Coffee, Moon, Sun, Target, Sparkles, Download, User, X, Check, Share2, Calendar } from "lucide-react";
import Link from "next/link";

const routineSteps = [
  {
    time: "Matin",
    icon: Sun,
    duration: "5 min",
    steps: [
      "Nettoyant visage doux",
      "Sérum anti-boutons (localisé)",
      "Crème hydratante légère"
    ],
    tips: "Commence la journée avec une peau propre et hydratée"
  },
  {
    time: "Midi",
    icon: Coffee,
    duration: "2 min",
    steps: [
      "Eau thermale (optionnel)",
      "Crème hydratante légère si besoin"
    ],
    tips: "Une pause fraîcheur pendant la pause déjeuner"
  },
  {
    time: "Soir",
    icon: Moon,
    duration: "7 min",
    steps: [
      "Démaquillant si nécessaire",
      "Nettoyant visage doux",
      "Masque purifiant (2x/semaine)",
      "Sérum anti-boutons",
      "Crème hydratante légère"
    ],
    tips: "La peau se régénère la nuit, sois régulier !"
  }
];

interface RoutineStepsModalProps {
  routine: RoutineType | null;
  isOpen: boolean;
  onClose: () => void;
}

function RoutineStepsModal({ routine, isOpen, onClose }: RoutineStepsModalProps) {
  if (!isOpen || !routine) return null;

  const steps = routine.steps ? routine.steps.split('\n').filter(step => step.trim()) : [];
  const products = routine.productsNeeded ? routine.productsNeeded.split('\n').filter(product => product.trim()) : [];

  const handleDownload = () => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
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

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="mb-6">
              <p className="text-gray-700">{routine.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Étapes de la routine</h3>
              <div className="space-y-3">
                {steps.length > 0 ? (
                  steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
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

            <div className="flex space-x-4 pt-6 border-t">
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                style={{ cursor: 'pointer' }}
              >
                <Download className="w-5 h-5" />
                <span>Télécharger la routine</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CustomizeRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CustomizeRoutineModal({ isOpen, onClose }: CustomizeRoutineModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    skinType: '',
    concerns: [] as string[],
    time: '',
    frequency: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    alert('🎉 Routine personnalisée générée avec succès ! Vous recevrez vos recommandations par email.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
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
          </div>

          <div className="p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Assistant de personnalisation
              </h3>
              <p className="text-gray-600 mb-8">
                Répondez à quelques questions pour créer votre routine personnalisée
              </p>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">🔍 En développement...</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Bientôt disponible : questionnaire complet avec recommandations personnalisées
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-6 border-t mt-8">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                  style={{ cursor: 'pointer' }}
                >
                  Fermer
                </button>
                
                <button
                  onClick={handleSubmit}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center space-x-2"
                  style={{ cursor: 'pointer' }}
                >
                  <Check className="w-5 h-5" />
                  <span>Notifier à la disponibilité</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Routine() {
  const [routines, setRoutines] = useState<RoutineType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineType | null>(null);
  const [isStepsModalOpen, setIsStepsModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        const data = await apiService.getRecommendedRoutines();
        setRoutines(data);
      } catch (err) {
        setError("Erreur lors du chargement des routines");
        console.error("Error fetching routines:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  const handleViewSteps = (routine: RoutineType) => {
    setSelectedRoutine(routine);
    setIsStepsModalOpen(true);
  };

  const handleDownloadGuide = () => {
    const guideContent = `
GUIDE PURESKIN - ROUTINE SPÉCIALE EXAMENS
==========================================

🎓 CONSEILS POUR UNE PEAU SAIN PENDANT LES EXAMENS

📚 TABLE DES MATIÈRES:
1. Gestion du stress et de la peau
2. Alimentation anti-boutons
3. Sommeil et récupération
4. Routine express 3 minutes
5. Produits recommandés
6. Plan semaine par semaine

⚡ ROUTINE EXPRESS 3 MINUTES:
Matin:
- Eau thermale pour rafraîchir
- Crème hydratante légère

Midi:
- Eau thermale (si besoin)

Soir:
- Démaquillant rapide
- Nettoyant doux
- Crème hydratante

🥗 ALIMENTATION RECOMMANDÉE:
- Beaucoup d'eau (2L/jour)
- Fruits et légumes frais
- Réduire le sucre et les produits laitiers
- Noix et graines pour les oméga-3

😴 SOMMEIL OPTIMAL:
- 7-8 heures par nuit minimum
- Éviter les écrans 1h avant de dormir
- Température de la chambre: 18-20°C
- Routine de relaxation avant de coucher

🧴 PRODUITS RECOMMANDÉS:
- Nettoyant doux sans sulfate
- Crème hydratante non comédogène
- Eau thermale en spray
- Masque purifiant (1x/semaine)

📅 PLAN SUR 2 SEMAINES:
Semaine 1: Focus sur l'hygiène de base
Semaine 2: Ajout des traitements ciblés

---
Généré par PureSkin Étudiant - ${new Date().toLocaleDateString()}
🌿 Prenez soin de votre peau, même pendant les examens !
    `.trim();

    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guide-pureskin-examens.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des routines...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              La routine parfaite
              <span className="text-green-600 block">pour étudiants pressés</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Des soins simples et rapides qui s'intègrent facilement dans ton emploi du temps
            </p>
          </div>

          {/* Dynamic Routines from API */}
          {routines.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                Routines recommandées pour vous
              </h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold text-gray-900">
                        {routine.name}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{routine.durationMinutes} min</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">
                      {routine.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                        {routine.difficultyLevel}
                      </span>
                      {routine.isRecommended && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          Recommandé
                        </span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleViewSteps(routine)}
                      className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
                      style={{ cursor: 'pointer' }}
                    >
                      Voir les étapes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Section */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-8 lg:p-12 mb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🎓 Routine spéciale examens
                </h3>
                <p className="text-gray-700 mb-6">
                  Le stress et le manque de sommeil pendant les examens peuvent provoquer des boutons. 
                  Notre guide PDF gratuit t'aide à garder une peau saine même dans les moments difficiles.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleDownloadGuide}
                    className="bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors flex items-center space-x-2"
                    style={{ cursor: 'pointer' }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Télécharger le guide gratuit</span>
                  </button>
                  <button 
                    onClick={() => setIsCustomizeModalOpen(true)}
                    className="inline-flex items-center border border-purple-600 text-purple-600 px-6 py-3 rounded-full hover:bg-purple-50 transition-colors justify-center"
                    style={{ cursor: 'pointer' }}
                  >
                    <User className="w-5 h-5 mr-2" />
                    Personnaliser ma routine
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Guide PDF 12 pages</h4>
                <p className="text-sm text-gray-600 mb-4">
                  + Conseils anti-stress<br/>
                  + Alimentation peau saine<br/>
                  + Sommeil et récupération<br/>
                  + Routine express 3min
                </p>
                <div className="text-xs text-gray-500">
                  ⭐ 4.9/5 (1,247 téléchargements)
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-lg text-gray-700 mb-4">
              Prêt(e) à avoir une peau magnifique sans y passer des heures ?
            </p>
            <Link 
              href="/produits"
              className="inline-flex items-center bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors"
              style={{ cursor: 'pointer' }}
            >
              Commencer ma routine
            </Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      <RoutineStepsModal 
        routine={selectedRoutine}
        isOpen={isStepsModalOpen}
        onClose={() => setIsStepsModalOpen(false)}
      />
      
      <CustomizeRoutineModal 
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
      />
    </>
  );
}
