"use client";

import { useState, useEffect } from "react";
import { AdminNav } from "@/components/AdminNav";
import { VideoManager } from "@/components/VideoManager";

export default function VideosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Vidéos</h1>
          <p className="mt-2 text-gray-600">
            Ajoutez et gérez les vidéos qui s'afficheront sur la page d'accueil
          </p>
        </div>
        
        <VideoManager />
      </div>
    </div>
  );
}
