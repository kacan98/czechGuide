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
      const marker = L.marker([restaurant.data.location.lat, restaurant.data.location.lng], {
        icon: L.divIcon({
          className: 'restaurant-marker',
          html: `
            <div class="relative">
              <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-3 cursor-pointer hover:shadow-xl transition-shadow duration-200 min-w-[200px]">
                <div class="flex items-start gap-2">
                  <div class="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm mb-1">${restaurant.data.name}</h4>
                    <p class="text-xs text-gray-500">${restaurant.data.cuisine}</p>
                  </div>
                </div>
              </div>
              <div class="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-white"></div>
                <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-gray-200 absolute left-1/2 transform -translate-x-1/2 -translate-y-[10px]"></div>
              </div>
              <div class="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-[10px] w-3 h-3 bg-red-600 rounded-full border-2 border-white shadow-md"></div>
            </div>
          `,
          iconSize: [200, 100],
          iconAnchor: [100, 90]
        })
      }).addTo(map)
      
      marker.on('click', () => {
        emit('restaurant-selected', restaurant)
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