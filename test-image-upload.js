// Script de test pour vérifier la création de produit avec image
const fs = require('fs');
const FormData = require('form-data');

// Test de création de produit avec image
async function testProductCreation() {
  try {
    // Créer un FormData simulé
    const formData = new FormData();
    formData.append('name', 'Produit Test Image');
    formData.append('slug', 'produit-test-image');
    formData.append('description', 'Test produit avec image uploadée');
    formData.append('price', '29.99');
    formData.append('category', 'Soins');
    formData.append('stock', '15');
    formData.append('active', 'true');
    formData.append('badge', 'new');
    
    // Ajouter une image test si disponible
    const imagePath = 'c:/Users/user/CascadeProjects/pureskin-etudiant/backend/uploads/products/product-298-1772808814886.jpg';
    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      formData.append('image', imageBuffer, {
        filename: 'test-product.jpg',
        contentType: 'image/jpeg'
      });
      console.log('✅ Image ajoutée au formulaire');
    } else {
      console.log('❌ Image test non trouvée');
    }

    // Envoyer la requête
    const response = await fetch('http://localhost:8080/api/admin/products', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Produit créé avec succès:', result);
      console.log('📷 URL de l\'image:', result.data?.imageUrl);
    } else {
      const error = await response.text();
      console.log('❌ Erreur lors de la création:', error);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testProductCreation();
