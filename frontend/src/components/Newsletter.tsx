import { Mail, Gift, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
  const [formData, setFormData] = useState({
    email: '',
    acceptTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalSubscribers: 15234,
    satisfactionRate: 4.9,
    recentSignups: 127
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.acceptTerms) {
      setSubmitStatus('error');
      setMessage('Veuillez remplir tous les champs et accepter les conditions');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: '' // Optionnel pour le moment
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setMessage('🎉 Bienvenue dans la communauté PureSkin ! Vérifiez votre email pour recevoir vos avantages.');
        setFormData({ email: '', acceptTerms: false });
        
        // Mettre à jour les stats
        setStats(prev => ({
          ...prev,
          totalSubscribers: prev.totalSubscribers + 1,
          recentSignups: prev.recentSignups + 1
        }));

        // Afficher les avantages
        setTimeout(() => {
          if (data.benefits) {
            setMessage(`✅ Code promo: ${data.benefits.promoCode} | 📖 Guide en téléchargement | 📧 Conseils hebdomadaires activés`);
          }
        }, 2000);
      } else {
        setSubmitStatus('error');
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      setSubmitStatus('error');
      setMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Gift className="w-4 h-4 mr-2" />
              Offre spéciale étudiants
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Prends soin de ta peau,
              <span className="block">nous t'offrons les avantages</span>
            </h2>
            
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Rejoins les 15,000 étudiants qui ont déjà transformé leur peau avec PureSkin
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Guide PDF gratuit</h3>
              <p className="text-sm text-white/80">
                Routine spéciale examens + conseils anti-stress
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🎫</span>
              </div>
              <h3 className="font-semibold mb-2">Code promo -30%</h3>
              <p className="text-sm text-white/80">
                Valable sur ta première commande étudiante
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Conseils hebdo</h3>
              <p className="text-sm text-white/80">
                Astuces peau + nouveautés + offres exclusives
              </p>
            </div>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl p-8 text-gray-900 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-2">Rejoins la communauté PureSkin</h3>
            <p className="text-gray-600 mb-6">
              Indique ton email étudiant et reçois immédiatement tous tes avantages
            </p>
            
            {/* Message de statut */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${
                submitStatus === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {submitStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                )}
                <span className="text-sm">{message}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="ton.email@etudiant.fr"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Inscription...
                    </>
                  ) : (
                    'M\'inscrire gratuitement'
                  )}
                </button>
              </div>
              
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                  className="mt-1" 
                  required 
                  disabled={isSubmitting}
                />
                <label htmlFor="terms">
                  J'accepte de recevoir les conseils peau et offres de PureSkin. 
                  Je peux me désinscrire à tout moment. 
                  <a href="#" className="text-green-600 hover:underline ml-1">Politique de confidentialité</a>
                </label>
              </div>
            </form>

            {/* Social Proof */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {stats.totalSubscribers.toLocaleString()} étudiants inscrits
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  {stats.satisfactionRate}/5 satisfaction
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Sans spam
                </div>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm">
            <div className="flex items-center">
              <span className="mr-2">🔒</span>
              Données sécurisées
            </div>
            <div className="flex items-center">
              <span className="mr-2">✉️</span>
              Désinscription 1 clic
            </div>
            <div className="flex items-center">
              <span className="mr-2">🎓</span>
              Exclusivement étudiants
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
