// Script pour vider le cache admin
console.log('🧹 Nettoyage complet du cache admin...');

if (typeof window !== 'undefined') {
  // Vider tous les tokens admin
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
  localStorage.removeItem("admin_user");
  localStorage.removeItem("admin_token");
  
  // Vider aussi la session storage
  sessionStorage.removeItem("admin_access_token");
  sessionStorage.removeItem("admin_refresh_token");
  sessionStorage.removeItem("admin_user");
  sessionStorage.removeItem("admin_token");
  
  console.log('✅ Cache admin vidé avec succès');
  console.log('🔄 Redirection vers /admin/login...');
  
  // Rediriger vers la page de login
  window.location.href = '/admin/login';
} else {
  console.log('❌ Ce script doit être exécuté dans le navigateur');
}
