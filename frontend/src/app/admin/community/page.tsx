"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Users, Mail, Calendar, TrendingUp, CheckCircle, XCircle, Search, Filter } from "lucide-react";

interface CommunityMember {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  university: string;
  source: string;
  studentVerified: boolean;
  guideDownloaded: boolean;
  promoCodeUsed: string;
  weeklyTipsActive: boolean;
  subscriptionDate: string;
  emailCount: number;
}

export default function CommunityPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");

  useEffect(() => {
    fetchCommunityMembers();
  }, []);

  const fetchCommunityMembers = async () => {
    try {
      const response = await fetch("/api/newsletter/subscribers");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMembers(data.subscribers || []);
        }
      }
    } catch (error) {
      console.error("Erreur récupération membres:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.university?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "verified" && member.studentVerified) ||
                         (filter === "unverified" && !member.studentVerified);
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: members.length,
    verified: members.filter(m => m.studentVerified).length,
    guideDownloads: members.filter(m => m.guideDownloaded).length,
    promoCodesUsed: members.filter(m => m.promoCodeUsed).length,
    weeklyTipsActive: members.filter(m => m.weeklyTipsActive).length
  };

  const handleCartClick = () => {
    console.log('Cart clicked in admin community page');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onCartClick={handleCartClick} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Communauté PureSkin</h1>
          <p className="text-gray-600">Gérez les membres de la communauté PureSkin Étudiant</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total membres</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Étudiants vérifiés</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Guides téléchargés</p>
                <p className="text-2xl font-bold text-blue-600">{stats.guideDownloads}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Codes promo utilisés</p>
                <p className="text-2xl font-bold text-purple-600">{stats.promoCodesUsed}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Newsletter active</p>
                <p className="text-2xl font-bold text-orange-600">{stats.weeklyTipsActive}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par email, nom ou université..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "all"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter("verified")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "verified"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Vérifiés
              </button>
              <button
                onClick={() => setFilter("unverified")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === "unverified"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Non vérifiés
              </button>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Université
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vérifié
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guide
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Newsletter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inscription
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.firstName} {member.lastName || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.university || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {member.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.studentVerified ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.guideDownloaded ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {member.weeklyTipsActive ? (
                          <CheckCircle className="w-5 h-5 text-orange-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(member.subscriptionDate).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun membre trouvé</h3>
                  <p className="text-gray-600">
                    {searchTerm || filter !== "all" 
                      ? "Essayez de modifier votre recherche ou vos filtres" 
                      : "Aucun membre dans la communauté pour le moment"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
