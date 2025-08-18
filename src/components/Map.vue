<template>
  <div class="map-container">
    <!-- Filter Controls -->
    <div class="mb-4 flex justify-center gap-2 flex-wrap">
      <button 
        @click="toggleCategory('restaurant')"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          activeFilter === 'restaurant' ? 'bg-red-600 text-white' : 
          activeFilter === null ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-gray-200 text-gray-500'
        ]"
      >
        🍽️ Full Restaurants ({{ getRestaurantsByCategory('restaurant').length }})
      </button>
      <button 
        @click="toggleCategory('pub')"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          activeFilter === 'pub' ? 'bg-orange-600 text-white' : 
          activeFilter === null ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'bg-gray-200 text-gray-500'
        ]"
      >
        🍺 Pubs & Beer ({{ getRestaurantsByCategory('pub').length }})
      </button>
      <button 
        @click="toggleCategory('bistro')"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          activeFilter === 'bistro' ? 'bg-amber-600 text-white' : 
          activeFilter === null ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-gray-200 text-gray-500'
        ]"
      >
        🥪 Bistros & Snacks ({{ getRestaurantsByCategory('bistro').length }})
      </button>
      <button 
        @click="toggleCategory('cafe')"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          activeFilter === 'cafe' ? 'bg-green-600 text-white' : 
          activeFilter === null ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-gray-200 text-gray-500'
        ]"
      >
        ☕ Cafés ({{ getRestaurantsByCategory('cafe').length }})
      </button>
      <button 
        @click="toggleAttractions"
        :class="[
          'px-3 py-2 rounded-lg text-sm font-medium transition',
          activeFilter === 'attractions' ? 'bg-blue-600 text-white' : 
          activeFilter === null ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-gray-200 text-gray-500'
        ]"
      >
        🏛️ Attractions ({{ attractions.length }})
      </button>
    </div>
    <div ref="mapContainer" class="w-full h-[600px] rounded-lg shadow-lg"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Dynamic import to avoid SSR issues
let L = null

const props = defineProps({
  restaurants: {
    type: Array,
    default: () => []
  },
  attractions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['restaurant-selected'])

const mapContainer = ref(null)
let map = null
let userMarker = null
let restaurantMarkers = []
let attractionMarkers = []

// Filter state - track which filter is active (null means all active)
const activeFilter = ref(null)

// Helper function to get restaurants by category
const getRestaurantsByCategory = (category) => {
  return props.restaurants.filter(r => r.data?.category === category)
}

onMounted(async () => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    // Dynamic import Leaflet
    L = (await import('leaflet')).default
    await initMap()
    if (props.restaurants?.length) {
      addRestaurantMarkers()
    }
    if (props.attractions?.length) {
      addAttractionMarkers()
    }
    getUserLocation()
    // Auto-zoom to fit all markers
    setTimeout(() => {
      fitMapToMarkers()
    }, 500)
  }
})

// Filter toggle functions
const toggleCategory = (category) => {
  if (activeFilter.value === category) {
    // If clicking the active filter, show all
    activeFilter.value = null
  } else {
    // Show only this category
    activeFilter.value = category
  }
  updateMarkerVisibility()
}

const toggleAttractions = () => {
  if (activeFilter.value === 'attractions') {
    // If clicking the active filter, show all
    activeFilter.value = null
  } else {
    // Show only attractions
    activeFilter.value = 'attractions'
  }
  updateMarkerVisibility()
}

const updateMarkerVisibility = () => {
  // Update restaurant markers based on active filter
  restaurantMarkers.forEach(marker => {
    const restaurant = marker._restaurant
    if (restaurant) {
      if (activeFilter.value === null || activeFilter.value === restaurant.data.category) {
        map.addLayer(marker)
      } else {
        map.removeLayer(marker)
      }
    }
  })
  
  // Update attraction markers
  attractionMarkers.forEach(marker => {
    if (activeFilter.value === null || activeFilter.value === 'attractions') {
      map.addLayer(marker)
    } else {
      map.removeLayer(marker)
    }
  })
}

const fitMapToMarkers = () => {
  if (!map || !L) return
  
  const allMarkers = [...restaurantMarkers, ...attractionMarkers]
  if (allMarkers.length === 0) return
  
  const group = new L.featureGroup(allMarkers)
  map.fitBounds(group.getBounds(), {
    padding: [20, 20],
    maxZoom: 15
  })
}

onUnmounted(() => {
  if (map) {
    map.remove()
  }
})

const initMap = async () => {
  if (!mapContainer.value || !L) return

  // Prague center coordinates
  const pragueCenter = [50.0755, 14.4378]
  
  map = L.map(mapContainer.value).setView(pragueCenter, 13)
  
  // Add tile layer with nice styling
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map)
}

const getUserLocation = () => {
  if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const userLocation = [latitude, longitude]
        
        // Add user location marker
        if (userMarker) {
          map.removeLayer(userMarker)
        }
        
        userMarker = L.marker(userLocation, {
          icon: L.divIcon({
            className: 'user-location-marker',
            html: '<div class="bg-blue-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          })
        }).addTo(map)
        
        // Don't change map center, keep focused on Prague
      },
      (error) => {
        console.log('Geolocation error:', error.message)
      }
    )
  }
}

const addRestaurantMarkers = () => {
  if (!map || !L) return
  
  // Clear existing markers
  restaurantMarkers.forEach(marker => map.removeLayer(marker))
  restaurantMarkers = []
  
  props.restaurants.forEach(restaurant => {
    if (restaurant.data?.location?.lat && restaurant.data?.location?.lng) {
      // Get color based on restaurant category
      const getCategoryColor = (category) => {
        switch(category) {
          case 'restaurant': return 'bg-red-600'
          case 'pub': return 'bg-orange-600' 
          case 'bistro': return 'bg-amber-600'
          case 'cafe': return 'bg-green-600'
          default: return 'bg-red-600'
        }
      }
      
      const categoryColor = getCategoryColor(restaurant.data.category)
      
      // Create a marker icon with category-specific color
      const marker = L.marker([restaurant.data.location.lat, restaurant.data.location.lng], {
        icon: L.divIcon({
          className: 'restaurant-marker',
          html: `
            <div class="relative cursor-pointer">
              <div class="w-10 h-10 ${categoryColor} rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41-6.88-6.88 1.37-1.37z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(map)
      
      // Get button text based on category
      const getButtonText = (category) => {
        switch(category) {
          case 'restaurant': return 'Visit Restaurant'
          case 'pub': return 'Visit Pub'
          case 'bistro': return 'Visit Bistro'
          case 'cafe': return 'Visit Café'
          default: return 'Visit Place'
        }
      }
      
      const buttonText = getButtonText(restaurant.data.category)
      const buttonColor = categoryColor.replace('bg-', 'bg-').replace('600', '600')
      
      // Create popup content
      const popupContent = `
        <div class="text-center">
          <h3 class="font-bold text-lg text-gray-900 mb-1">${restaurant.data.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${restaurant.data.cuisine}</p>
          <p class="text-xs text-gray-500 mb-3">${restaurant.data.address}</p>
          <button class="visit-restaurant ${buttonColor} text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition" data-slug="${restaurant.slug}">
            ${buttonText} →
          </button>
        </div>
      `
      
      marker.bindPopup(popupContent, {
        maxWidth: 250,
        closeButton: true
      })
      
      // Handle popup button clicks
      marker.on('popupopen', () => {
        const popup = marker.getPopup()
        const popupElement = popup.getElement()
        const visitButton = popupElement.querySelector('.visit-restaurant')
        
        if (visitButton) {
          visitButton.addEventListener('click', () => {
            const slug = visitButton.getAttribute('data-slug')
            window.location.href = `/restaurant/${slug}/`
          })
        }
      })
      
      // Store restaurant reference for filtering
      marker._restaurant = restaurant
      restaurantMarkers.push(marker)
    }
  })
}

const addAttractionMarkers = () => {
  if (!map || !L) return
  
  // Clear existing markers
  attractionMarkers.forEach(marker => map.removeLayer(marker))
  attractionMarkers = []
  
  props.attractions.forEach(attraction => {
    if (attraction.data?.location?.lat && attraction.data?.location?.lng) {
      // Create attraction marker with different icon
      const marker = L.marker([attraction.data.location.lat, attraction.data.location.lng], {
        icon: L.divIcon({
          className: 'attraction-marker',
          html: `
            <div class="relative cursor-pointer">
              <div class="w-10 h-10 bg-blue-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform duration-200">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        })
      }).addTo(map)
      
      // Create popup content for attractions
      const popupContent = `
        <div class="text-center">
          <h3 class="font-bold text-lg text-gray-900 mb-1">${attraction.data.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${attraction.data.type}</p>
          <p class="text-xs text-gray-500 mb-3">${attraction.data.address}</p>
          ${attraction.data.entryFee ? `<p class="text-xs text-gray-500 mb-2">Entry: ${attraction.data.entryFee}</p>` : ''}
          <button class="visit-attraction bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition" data-slug="${attraction.slug}">
            Learn More
          </button>
        </div>
      `
      
      marker.bindPopup(popupContent, {
        maxWidth: 250,
        closeButton: true
      })
      
      attractionMarkers.push(marker)
    }
  })
}

// Watch for restaurant changes
import { watch } from 'vue'
watch(() => props.restaurants, () => {
  if (map && L && props.restaurants?.length) {
    addRestaurantMarkers()
  }
}, { deep: true })
</script>

<style>
.map-container {
  position: relative;
}

/* Custom marker styles */
.user-location-marker {
  background: transparent !important;
  border: none !important;
}

.restaurant-marker {
  background: transparent !important;
  border: none !important;
}

/* Leaflet popup styling */
.leaflet-popup-content-wrapper {
  @apply rounded-lg shadow-lg;
}

.leaflet-popup-content {
  @apply text-gray-800;
}

/* Line clamp for marker descriptions */
.restaurant-marker .line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>