"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, X, Play, Pause, Trash2, Download, Eye, Edit2, Save, RotateCcw } from "lucide-react";

interface VideoFile {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
}

interface VideoUploadResponse {
  success: boolean;
  filename?: string;
  url?: string;
  message?: string;
  error?: string;
}

export function VideoManager() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [editingVideo, setEditingVideo] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deletingVideo, setDeletingVideo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // Load existing videos
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVideos(result.videos || []);
          console.log('✅ Videos loaded successfully:', result.videos);
        } else {
          const errorMessage = result.error || 'Erreur inconnue lors du chargement des vidéos';
          console.error('❌ Error loading videos:', errorMessage);
          setVideos([]);
        }
      } else {
        console.error('❌ Failed to load videos, status:', response.status);
        setVideos([]);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback to static videos for demo
      setVideos([
        {
          id: '1',
          name: 'WhatsApp Video 2026-03-11 at 14.56.17.mp4',
          url: '/videos/WhatsApp Video 2026-03-11 at 14.56.17.mp4',
          size: 4204555,
          uploadedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'WhatsApp Video 2026-03-12 at 12.40.59.mp4',
          url: '/videos/WhatsApp Video 2026-03-12 at 12.40.59.mp4',
          size: 9523726,
          uploadedAt: new Date().toISOString()
        }
      ]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];
    
    // Check if file is video
    if (!file.type.startsWith('video/')) {
      alert('Veuillez sélectionner un fichier vidéo');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('La vidéo ne doit pas dépasser 50MB');
      return;
    }

    await uploadVideo(file);
  };

  const uploadVideo = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const xhr = new XMLHttpRequest();
      
      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Create promise for XHR
      const uploadPromise = new Promise<{
        success: boolean;
        filename?: string;
        url?: string;
        message?: string;
      }>((resolve, reject) => {
        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.ontimeout = () => reject(new Error('Upload timeout'));
        xhr.timeout = 60000; // 60 seconds timeout
      });

      xhr.open('POST', '/api/admin/videos');
      
      // Important: ne pas définir Content-Type manuellement pour FormData
      // Le navigateur le fera automatiquement avec le boundary correct
      xhr.send(formData);

      const result: VideoUploadResponse = await uploadPromise;
      
      // Add new video to list only if upload was successful
      if (result.success) {
        const newVideo: VideoFile = {
          id: result.filename || Date.now().toString(),
          name: file.name,
          url: result.url || `/videos/${result.filename}`,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        setVideos(prev => [newVideo, ...prev]);
        console.log('✅ Video uploaded successfully:', result);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
      
    } catch (error: any) {
      console.error('Upload error:', error);
      let errorMessage = 'Erreur lors de l\'upload de la vidéo';
      
      if (error.message.includes('413')) {
        errorMessage = 'Fichier trop volumineux (max 50MB)';
      } else if (error.message.includes('415')) {
        errorMessage = 'Format de fichier non supporté';
      } else if (error.message.includes('Network error')) {
        errorMessage = 'Erreur réseau lors de l\'upload';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'L\'upload a pris trop de temps';
      } else if (error.message.includes('Failed to parse')) {
        errorMessage = 'Réponse serveur invalide';
      }
      
      alert(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteVideo = async (videoId: string) => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return;

    setDeletingVideo(videoId);
    
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVideos(prev => prev.filter(v => v.id !== videoId));
          alert('Vidéo supprimée avec succès');
          console.log('✅ Video deleted successfully:', result);
        } else {
          const errorMessage = result.error || 'Erreur inconnue lors de la suppression';
          alert('Erreur lors de la suppression: ' + errorMessage);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error deleting video:', errorText);
        alert('Erreur lors de la suppression: ' + errorText);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression de la vidéo');
    } finally {
      setDeletingVideo(null);
    }
  };

  const startEditing = (videoId: string, currentName: string) => {
    setEditingVideo(videoId);
    setEditingName(currentName);
  };

  const saveVideoName = async (videoId: string) => {
    if (!editingName.trim()) {
      alert('Le nom ne peut pas être vide');
      return;
    }

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVideos(prev => prev.map(v => 
            v.id === videoId ? { ...v, name: editingName } : v
          ));
          setEditingVideo(null);
          setEditingName("");
          alert('Nom modifié avec succès');
          console.log('✅ Video name updated successfully:', result);
        } else {
          const errorMessage = result.error || 'Erreur inconnue lors de la mise à jour';
          alert('Erreur lors de la mise à jour: ' + errorMessage);
        }
      } else {
        const errorText = await response.text();
        console.error('❌ Error updating video:', errorText);
        alert('Erreur lors de la mise à jour: ' + errorText);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Erreur lors de la mise à jour du nom');
    }
  };

  const cancelEditing = () => {
    setEditingVideo(null);
    setEditingName("");
  };

  const togglePlay = (videoId: string) => {
    const videoElement = videoRefs.current[videoId];
    
    if (playingVideo === videoId && videoElement) {
      videoElement.pause();
      setPlayingVideo(null);
    } else {
      // Stop any currently playing video
      if (playingVideo && videoRefs.current[playingVideo]) {
        videoRefs.current[playingVideo]?.pause();
      }
      
      if (videoElement) {
        videoElement.play().catch(error => {
          console.error("Error playing video:", error);
        });
        setPlayingVideo(videoId);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une vidéo</h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          <p className="text-gray-600 mb-2">
            Glissez-déposez une vidéo ici ou{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              parcourez les fichiers
            </button>
          </p>
          
          <p className="text-sm text-gray-500">
            Formats supportés: MP4, WebM, MOV (max 50MB)
          </p>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Upload en cours...</span>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Vidéos existantes ({videos.length})
        </h2>
        
        {videos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucune vidéo disponible. Ajoutez votre première vidéo ci-dessus.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Video Preview */}
                <div className="relative h-40 bg-black">
                  <video
                    ref={(el) => { videoRefs.current[video.id] = el; }}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    loop
                  >
                    <source src={video.url} type="video/mp4" />
                    Votre navigateur ne supporte pas les vidéos.
                  </video>
                  
                  {/* Video Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => togglePlay(video.id)}
                      className="bg-white rounded-full p-2 mx-1"
                    >
                      {playingVideo === video.id ? (
                        <Pause className="w-4 h-4 text-gray-800" />
                      ) : (
                        <Play className="w-4 h-4 text-gray-800" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => window.open(video.url, '_blank')}
                      className="bg-white rounded-full p-2 mx-1"
                      title="Voir en plein écran"
                    >
                      <Eye className="w-4 h-4 text-gray-800" />
                    </button>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="p-4">
                  {/* Video Name with Edit */}
                  <div className="mb-2">
                    {editingVideo === video.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-2 text-gray-600 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Nom de la vidéo"
                        />
                        <button
                          onClick={() => saveVideoName(video.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Sauvegarder"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                          title="Annuler"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate flex-1">
                          {video.name}
                        </h3>
                        <button
                          onClick={() => startEditing(video.id, video.name)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded ml-1"
                          title="Modifier le nom"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Taille: {formatFileSize(video.size)}</p>
                    <p>Upload: {formatDate(video.uploadedAt)}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => window.open(video.url, '_blank')}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-3 h-3 inline mr-1" />
                      Télécharger
                    </button>
                    
                    <button
                      onClick={() => deleteVideo(video.id)}
                      disabled={deletingVideo === video.id}
                      className={`flex-1 px-3 py-1 rounded text-sm transition-colors ${
                        deletingVideo === video.id
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      {deletingVideo === video.id ? (
                        <>
                          <RotateCcw className="w-3 h-3 inline mr-1 animate-spin" />
                          Suppression...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3 inline mr-1" />
                          Supprimer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
