<template>
  <div class="map-container">
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
  }
})

const emit = defineEmits(['restaurant-selected'])

const mapContainer = ref(null)
let map = null
let userMarker = null
let restaurantMarkers = []

onMounted(async () => {
  // Only run on client side
  if (typeof window !== 'undefined') {
    // Dynamic import Leaflet
    L = (await import('leaflet')).default
    await initMap()
    if (props.restaurants?.length) {
      addRestaurantMarkers()
    }
    getUserLocation()
  }
})

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
      // Create a simple marker icon with fork and knife
      const marker = L.marker([restaurant.data.location.lat, restaurant.data.location.lng], {
        icon: L.divIcon({
          className: 'restaurant-marker',
          html: `
            <div class="relative cursor-pointer">
              <div class="w-10 h-10 bg-red-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center hover:scale-110 transition-transform duration-200">
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
      
      // Create popup content
      const popupContent = `
        <div class="text-center">
          <h3 class="font-bold text-lg text-gray-900 mb-1">${restaurant.data.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${restaurant.data.cuisine}</p>
          <p class="text-xs text-gray-500 mb-3">${restaurant.data.address}</p>
          <button class="visit-restaurant bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition" data-slug="${restaurant.slug}">
            Visit Restaurant
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
      
      restaurantMarkers.push(marker)
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