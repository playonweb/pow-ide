<template>
  <div 
    v-if="modelValue" 
    ref="menuRef"
    class="absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-4 w-64 mt-2"
  >
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Boilerplates</h3>
      <button @click="closeMenu" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-400 dark:hover:text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <!-- Search input -->
    <div class="relative mb-3">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
      </div>
      <input 
        type="text" 
        v-model="searchText" 
        class="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
        placeholder="Search templates..." 
      />
    </div>
    
    <!-- Templates list with max height and scrolling -->
    <div class="max-h-[300px] overflow-y-auto pr-1">
      <ul v-if="filteredTemplates.length" class="space-y-3">
        <li v-for="template in filteredTemplates" :key="template.id">
          <a @click.prevent="selectBoilerplate(template.file)" href="#" 
             class="flex items-center gap-3 p-2 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <!-- <img :src="template.icon" :alt="template.name" class="w-6 h-6 dark:invert" /> -->
            <!-- if icon then show image if svg then show svg -->
            <img v-if="template.icon" :src="template.icon" :alt="template.name" class="w-6 h-6 dark:invert" />
            <span v-else class="w-6 h-6 flex items-center justify-center">
              <span v-html="template.svg || template.icon"></span>
            </span>
            <div class="flex-grow">
              <div class="font-medium">{{ template.name }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ template.description }}</div>
            </div>
            <button 
              @click.stop.prevent="previewBoilerplate(template.file)"
              title="Preview in new tab"
              class="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </button>
          </a>
        </li>
      </ul>
      <div v-else class="text-center py-4 text-gray-500 dark:text-gray-400">
        No templates found
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

// Template data
const templates = [
  {
    id: 1,
    name: 'Vanilla JS',
    slug: 'vanilla-js',
    description: 'Plain HTML & JavaScript',
    file: 'vanilla.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg'
  },
  {
    id: 1.1,
    name: 'TypeScript',
    slug: 'typescript',
    description: 'TypeScript with JSX support',
    file: 'typescript.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg'
  },
  {
    id: 2,
    name: 'React',
    slug: 'react',
    description: 'React with JSX support',
    file: 'react.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg'
  },
  {
    id: 3,
    name: 'Vue',
    slug: 'vue',
    description: 'Vue 3 with Composition API',
    file: 'vue.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/vuedotjs.svg'
  },
  {
    id: 4,
    name: 'Angular',
    slug: 'angular',
    description: 'Basic Angular application',
    file: 'angular.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/angular.svg'
  },
  {
    id: 5,
    name: 'Tailwind CSS',
    slug: 'tailwind',
    description: 'Responsive layout with Tailwind',
    file: 'tailwind.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/tailwindcss.svg'
  },
  {
    id: 6,
    name: 'Bootstrap',
    slug: 'bootstrap',
    description: 'Bootstrap 5 components',
    file: 'bootstrap.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/bootstrap.svg'
  },
  {
    id: 7,
    name: 'HTMX',
    slug: 'htmx',
    description: 'AJAX with HTML attributes',
    file: 'htmx.html',
    icon: 'https://htmx.org/favicon.svg'
  },
  {
    id: 8,
    name: 'Alpine.js',
    slug: 'alpine',
    description: 'Lightweight JavaScript framework',
    file: 'alpine.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/alpinedotjs.svg'
  },
  {
    id: 9,
    name: 'Stimulus - Rails',
    slug: 'stimulus',
    description: 'HTML over the wire',
    file: 'stimulus.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/stimulus.svg'
  },
  {
    id: 10,
    name: 'Turbo - Rails',
    slug: 'turbo',
    description: 'HTML over the wire',
    file: 'turbo.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/turbo.svg'
  },
  {
    id: 11,
    name: 'Firebase',
    slug: 'firebase',
    description: 'Real-time database & auth',
    file: 'firebase.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/firebase.svg'
  },
  {
    id: 12,
    name: 'GSAP',
    slug: 'gsap',
    description: 'Professional animation library',
    file: 'gsap.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/greensock.svg'
  },
  {
    id: 13,
    name: 'D3.js',
    slug: 'd3',
    description: 'Data visualization library',
    file: 'd3.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/d3dotjs.svg'
  },
  {
    id: 14,
    name: 'Lit',
    slug: 'lit',
    description: 'Simple web components',
    file: 'lit.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/lit.svg'
  },
  {
    id: 15,
    name: 'Three.js',
    slug: 'three-js',
    description: '3D graphics in the browser',
    file: 'threejs.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/threedotjs.svg'
  },
  {
    id: 16,
    name: 'Google Drive',
    slug: 'google-drive',
    description: 'Google Drive API integration',
    file: 'google-drive.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googledrive.svg'
  },
  // shoelace, moustache
  {
    id: 17,
    name: 'Shoelace',
    slug: 'shoelace',
    description: 'Modern UI components',
    file: 'shoelace.html',
    icon: 'https://shoelace.style/assets/images/wordmark.svg'
  },
  {
    id: 18,
    name: 'Mustache',
    slug: 'mustache',
    description: 'Logic-less templates',
    file: 'mustache.html',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 100 100"><text x="50" y="50" font-size="80" transform="rotate(90 50 50)">{</text></svg>'
  },
  {
    id: 19,
    name: 'CoffeeScript',
    slug: 'coffeescript',
    description: 'CoffeeScript template',
    file: 'coffeescript.html',
    icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/coffeescript.svg'
  },
  {
    id: 20,
    name: 'Underscore.js',
    slug: 'underscore-js',
    description: 'Utility library for JavaScript',
    file: 'underscore-js.html',
    icon: 'https://underscorejs.org/favicon.ico'
  },
];

// Search functionality
const searchText = ref('');
const filteredTemplates = computed(() => {
  if (!searchText.value) return templates;
  
  const searchLower = searchText.value.toLowerCase();
  return templates.filter(template => 
    template.name.toLowerCase().includes(searchLower) || 
    template.description.toLowerCase().includes(searchLower)
  );
});

// Click outside handling
const menuRef = ref(null);

const handleClickOutside = (event) => {
  if (props.modelValue && menuRef.value && !menuRef.value.contains(event.target)) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Ensure search is reset when menu is opened
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    searchText.value = '';
  }
});

const closeMenu = () => {
  emit('update:modelValue', false);
};

const selectBoilerplate = (template) => {
  emit('select', template);
  closeMenu();
};

const previewBoilerplate = (template) => {
  window.open(`/boilerplates/${template}`, template);
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const templateSlug = urlParams.get('template');
  if (templateSlug) {
    const template = templates.find(t => t.slug === templateSlug);
    if (template) {
      selectBoilerplate(template.file);
    }
  }

  if (window.history.replaceState) {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.toString());
  }
});
</script>
