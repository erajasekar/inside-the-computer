// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollSpy();
    initializeFunFacts();
    addSmoothScrolling();
    initializePCInterior();
});

// Navigation functionality
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            updateActiveNavLink(this);
        });
    });
}

// Show specific section
function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Smooth scroll to top of the section
        setTimeout(() => {
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }, 50);
    }
}

// Update active navigation link
function updateActiveNavLink(activeLink) {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Scroll spy functionality
function initializeScrollSpy() {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const correspondingNavLink = document.querySelector(`[data-section="${sectionId}"]`);
                
                if (correspondingNavLink) {
                    updateActiveNavLink(correspondingNavLink);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Fun facts toggle functionality
function initializeFunFacts() {
    const funFactButtons = document.querySelectorAll('.fun-fact-btn');
    
    funFactButtons.forEach(button => {
        button.addEventListener('click', function() {
            const factId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            toggleFunFact(factId);
        });
    });
}

// Toggle fun fact visibility
function toggleFunFact(factId) {
    const funFact = document.getElementById(factId);
    const button = document.querySelector(`[onclick*="${factId}"]`);
    
    if (funFact) {
        if (funFact.classList.contains('hidden')) {
            // Show the fun fact
            funFact.classList.remove('hidden');
            funFact.classList.add('show');
            button.textContent = '🔼 Hide Fun Fact';
            
            // Smooth scroll to make sure the fact is visible
            setTimeout(() => {
                funFact.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 100);
        } else {
            // Hide the fun fact
            funFact.classList.add('hidden');
            funFact.classList.remove('show');
            button.textContent = '💡 Fun Fact!';
        }
    }
}

// Smooth scrolling for explore button
function scrollToSection(sectionId) {
    showSection(sectionId);
    const correspondingNavLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (correspondingNavLink) {
        updateActiveNavLink(correspondingNavLink);
    }
}

// Add smooth scrolling behavior
function addSmoothScrolling() {
    // Handle hash links in URL
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => {
            showSection(sectionId);
            const correspondingNavLink = document.querySelector(`[data-section="${sectionId}"]`);
            if (correspondingNavLink) {
                updateActiveNavLink(correspondingNavLink);
            }
        }, 100);
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Allow navigation with arrow keys
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const currentActiveLink = document.querySelector('.nav-link.active');
        const currentIndex = Array.from(navLinks).indexOf(currentActiveLink);
        
        let nextIndex;
        if (e.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % navLinks.length;
        } else {
            nextIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
        }
        
        const nextLink = navLinks[nextIndex];
        const targetSection = nextLink.getAttribute('data-section');
        
        showSection(targetSection);
        updateActiveNavLink(nextLink);
        
        e.preventDefault();
    }
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove shadow based on scroll position
    if (scrollTop > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
function initializeAnimations() {
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe hardware cards for entrance animations
    const hardwareCards = document.querySelectorAll('.hardware-card');
    hardwareCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animationObserver.observe(card);
    });
}

// Initialize animations after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeAnimations, 500);
});

// Mobile menu toggle (for future enhancement)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization for scroll events
const debouncedScrollHandler = debounce(function() {
    // Any scroll-based functionality can be added here
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Preload next section for better performance
function preloadNextSection() {
    const activeSection = document.querySelector('.section.active');
    const allSections = Array.from(sections);
    const currentIndex = allSections.indexOf(activeSection);
    
    if (currentIndex < allSections.length - 1) {
        const nextSection = allSections[currentIndex + 1];
        // Preload any images or content in the next section
        const images = nextSection.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Error handling for missing elements
function handleMissingElements() {
    if (navLinks.length === 0) {
        console.warn('Navigation links not found');
    }
    
    if (sections.length === 0) {
        console.warn('Sections not found');
    }
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleMissingElements);

// 3D PC Interior functionality
function initializePCInterior() {
    const components = document.querySelectorAll('[data-component]');
    const componentInfo = document.getElementById('component-info');
    const componentTitle = document.getElementById('component-title');
    const componentDescription = document.getElementById('component-description');
    
    // Component information data
    const componentData = {
        cpu: {
            title: 'CPU - Central Processing Unit',
            description: 'The brain of your computer! This powerful chip processes all instructions and calculations. The heatsink and fan on top keep it cool while it works at incredible speeds.'
        },
        gpu: {
            title: 'GPU - Graphics Processing Unit',
            description: 'The graphics powerhouse! This component renders all the beautiful visuals you see on your screen. Those spinning fans keep it cool during intense gaming sessions.'
        },
        ram: {
            title: 'RAM - Random Access Memory',
            description: 'Your computer\'s short-term memory! These colorful sticks store data that your CPU needs quick access to. More RAM means your computer can multitask better.'
        },
        storage: {
            title: 'Storage Drives',
            description: 'Your computer\'s long-term memory! The thin SSD provides lightning-fast access to your files, while the larger HDD offers massive storage capacity.'
        },
        motherboard: {
            title: 'Motherboard',
            description: 'The nervous system of your PC! This green circuit board connects all components together, allowing them to communicate and work as a team.'
        },
        power: {
            title: 'Power Supply Unit (PSU)',
            description: 'The heart that pumps life into your PC! It converts wall power into the precise voltages each component needs, with colorful cables delivering power throughout the system.'
        }
    };
    
    // Add click handlers to components
    components.forEach(component => {
        component.addEventListener('click', function() {
            const componentType = this.getAttribute('data-component');
            highlightComponent(this, componentType);
            updateComponentInfo(componentType);
        });
        
        // Add hover effects
        component.addEventListener('mouseenter', function() {
            this.style.transform += ' scale(1.05)';
            this.style.filter = 'brightness(1.2)';
        });
        
        component.addEventListener('mouseleave', function() {
            if (!this.classList.contains('component-highlight')) {
                this.style.transform = this.style.transform.replace(' scale(1.05)', '');
                this.style.filter = '';
            }
        });
    });
    
    function highlightComponent(element, componentType) {
        // Remove previous highlights
        components.forEach(comp => {
            comp.classList.remove('component-highlight');
            comp.style.transform = comp.style.transform.replace(' scale(1.05)', '');
            comp.style.filter = '';
        });
        
        // Add highlight to selected component
        element.classList.add('component-highlight');
        
        // Add pulsing animation
        element.style.animation = 'componentPulse 2s ease-in-out infinite';
        setTimeout(() => {
            element.style.animation = '';
        }, 4000);
    }
    
    function updateComponentInfo(componentType) {
        const data = componentData[componentType];
        if (data) {
            componentTitle.textContent = data.title;
            componentDescription.textContent = data.description;
            
            // Add smooth transition effect
            componentInfo.style.transform = 'scale(0.95)';
            componentInfo.style.opacity = '0.7';
            
            setTimeout(() => {
                componentInfo.style.transform = 'scale(1)';
                componentInfo.style.opacity = '1';
            }, 150);
        }
    }
}

// Function to show PC Interior (called from explore button)
function showPCInterior() {
    showSection('pc-interior');
    
    // Add entrance animation
    const pcCase = document.querySelector('.pc-case');
    if (pcCase) {
        pcCase.style.opacity = '0';
        pcCase.style.transform = 'rotateX(15deg) rotateY(-25deg) translateY(50px)';
        
        setTimeout(() => {
            pcCase.style.transition = 'all 1s ease-out';
            pcCase.style.opacity = '1';
            pcCase.style.transform = 'rotateX(15deg) rotateY(-25deg) translateY(0px)';
        }, 300);
    }
    
    // Animate components in sequence
    const components = document.querySelectorAll('[data-component]');
    components.forEach((component, index) => {
        component.style.opacity = '0';
        component.style.transform += ' translateY(20px)';
        
        setTimeout(() => {
            component.style.transition = 'all 0.6s ease-out';
            component.style.opacity = '1';
            component.style.transform = component.style.transform.replace(' translateY(20px)', '');
        }, 800 + (index * 200));
    });
}

// Enhanced scroll to section for PC interior
function scrollToSection(sectionId) {
    if (sectionId === 'pc-interior') {
        showPCInterior();
    } else {
        showSection(sectionId);
        const correspondingNavLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (correspondingNavLink) {
            updateActiveNavLink(correspondingNavLink);
        }
    }
}

// Add CSS animation for component pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes componentPulse {
        0%, 100% { 
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.8);
            filter: brightness(1.3);
        }
        50% { 
            box-shadow: 0 0 50px rgba(102, 126, 234, 1);
            filter: brightness(1.5);
        }
    }
`;
document.head.appendChild(style);

// Mouse tracking for enhanced 3D effect
function initializeMouseTracking() {
    const pcCase = document.querySelector('.pc-case');
    const pcSection = document.querySelector('.pc-interior-section');
    
    if (pcCase && pcSection) {
        pcSection.addEventListener('mousemove', function(e) {
            const rect = pcSection.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * 10;
            const rotateY = (mouseX / rect.width) * 10;
            
            pcCase.style.transform = `rotateX(${15 - rotateX}deg) rotateY(${-25 + rotateY}deg)`;
        });
        
        pcSection.addEventListener('mouseleave', function() {
            pcCase.style.transform = 'rotateX(15deg) rotateY(-25deg)';
        });
    }
}

// Initialize mouse tracking when PC interior is shown
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeMouseTracking, 1000);
});

// PC Builder functionality
let currentBuild = {
    cpu: null,
    gpu: null,
    ram: null,
    storage: null,
    motherboard: null,
    psu: null
};

// Component database with realistic pricing and performance data
const componentDatabase = {
    cpu: [
        { id: 'intel-i5-13600k', name: 'Intel Core i5-13600K', price: 319, performance: 85, cores: 14, threads: 20 },
        { id: 'intel-i7-13700k', name: 'Intel Core i7-13700K', price: 419, performance: 95, cores: 16, threads: 24 },
        { id: 'intel-i9-13900k', name: 'Intel Core i9-13900K', price: 589, performance: 100, cores: 24, threads: 32 },
        { id: 'amd-ryzen5-7600x', name: 'AMD Ryzen 5 7600X', price: 299, performance: 82, cores: 6, threads: 12 },
        { id: 'amd-ryzen7-7700x', name: 'AMD Ryzen 7 7700X', price: 399, performance: 92, cores: 8, threads: 16 },
        { id: 'amd-ryzen9-7900x', name: 'AMD Ryzen 9 7900X', price: 549, performance: 98, cores: 12, threads: 24 }
    ],
    gpu: [
        { id: 'rtx-4060', name: 'NVIDIA RTX 4060', price: 299, performance: 70, vram: 8, tier: 'mid' },
        { id: 'rtx-4060ti', name: 'NVIDIA RTX 4060 Ti', price: 399, performance: 78, vram: 16, tier: 'mid' },
        { id: 'rtx-4070', name: 'NVIDIA RTX 4070', price: 599, performance: 85, vram: 12, tier: 'high' },
        { id: 'rtx-4070ti', name: 'NVIDIA RTX 4070 Ti', price: 799, performance: 92, vram: 12, tier: 'high' },
        { id: 'rtx-4080', name: 'NVIDIA RTX 4080', price: 1199, performance: 98, vram: 16, tier: 'ultra' },
        { id: 'rx-7600', name: 'AMD RX 7600', price: 269, performance: 68, vram: 8, tier: 'mid' },
        { id: 'rx-7700xt', name: 'AMD RX 7700 XT', price: 449, performance: 80, vram: 12, tier: 'mid' },
        { id: 'rx-7800xt', name: 'AMD RX 7800 XT', price: 499, performance: 87, vram: 16, tier: 'high' },
        { id: 'rx-7900xt', name: 'AMD RX 7900 XT', price: 899, performance: 95, vram: 20, tier: 'ultra' }
    ],
    ram: [
        { id: 'ddr4-16gb-3200', name: '16GB DDR4-3200 (2x8GB)', price: 89, capacity: 16, speed: 3200, type: 'DDR4' },
        { id: 'ddr4-32gb-3200', name: '32GB DDR4-3200 (2x16GB)', price: 179, capacity: 32, speed: 3200, type: 'DDR4' },
        { id: 'ddr5-16gb-5600', name: '16GB DDR5-5600 (2x8GB)', price: 129, capacity: 16, speed: 5600, type: 'DDR5' },
        { id: 'ddr5-32gb-5600', name: '32GB DDR5-5600 (2x16GB)', price: 249, capacity: 32, speed: 5600, type: 'DDR5' },
        { id: 'ddr5-32gb-6000', name: '32GB DDR5-6000 (2x16GB)', price: 299, capacity: 32, speed: 6000, type: 'DDR5' }
    ],
    storage: [
        { id: 'nvme-500gb', name: '500GB NVMe SSD', price: 59, capacity: 500, type: 'NVMe', speed: 3500 },
        { id: 'nvme-1tb', name: '1TB NVMe SSD', price: 99, capacity: 1000, type: 'NVMe', speed: 3500 },
        { id: 'nvme-2tb', name: '2TB NVMe SSD', price: 199, capacity: 2000, type: 'NVMe', speed: 3500 },
        { id: 'sata-1tb', name: '1TB SATA SSD', price: 79, capacity: 1000, type: 'SATA', speed: 550 },
        { id: 'hdd-2tb', name: '2TB HDD 7200RPM', price: 59, capacity: 2000, type: 'HDD', speed: 150 }
    ],
    motherboard: [
        { id: 'b550-amd', name: 'AMD B550 Motherboard', price: 129, socket: 'AM4', chipset: 'B550', features: ['WiFi', 'Bluetooth'] },
        { id: 'x570-amd', name: 'AMD X570 Motherboard', price: 199, socket: 'AM4', chipset: 'X570', features: ['WiFi', 'Bluetooth', 'PCIe 4.0'] },
        { id: 'b760-intel', name: 'Intel B760 Motherboard', price: 149, socket: 'LGA1700', chipset: 'B760', features: ['WiFi', 'Bluetooth'] },
        { id: 'z790-intel', name: 'Intel Z790 Motherboard', price: 249, socket: 'LGA1700', chipset: 'Z790', features: ['WiFi', 'Bluetooth', 'Overclocking'] }
    ],
    psu: [
        { id: 'psu-650w-bronze', name: '650W 80+ Bronze PSU', price: 89, wattage: 650, efficiency: 'Bronze', modular: false },
        { id: 'psu-750w-gold', name: '750W 80+ Gold PSU', price: 129, wattage: 750, efficiency: 'Gold', modular: true },
        { id: 'psu-850w-gold', name: '850W 80+ Gold PSU', price: 159, wattage: 850, efficiency: 'Gold', modular: true },
        { id: 'psu-1000w-platinum', name: '1000W 80+ Platinum PSU', price: 219, wattage: 1000, efficiency: 'Platinum', modular: true }
    ]
};

// FPS estimation data based on real-world benchmarks
const fpsDatabase = {
    fortnite: {
        // Base FPS for different GPU tiers at 1080p High settings
        baseFps: { low: 45, mid: 85, high: 120, ultra: 165 },
        cpuMultiplier: 0.15, // CPU impact on FPS
        ramMultiplier: 0.05  // RAM impact on FPS
    },
    apex: {
        baseFps: { low: 40, mid: 75, high: 110, ultra: 150 },
        cpuMultiplier: 0.12,
        ramMultiplier: 0.04
    },
    csgo: {
        baseFps: { low: 120, mid: 200, high: 300, ultra: 450 },
        cpuMultiplier: 0.25, // CS:GO is more CPU dependent
        ramMultiplier: 0.08
    }
};

// Initialize PC Builder
function initializePCBuilder() {
    populateComponentDropdowns();
    setupEventListeners();
    updateTotalCost();
    updateFPSEstimates();
}

// Populate dropdown menus with components
function populateComponentDropdowns() {
    Object.keys(componentDatabase).forEach(componentType => {
        const dropdown = document.getElementById(`${componentType}-select`);
        if (dropdown) {
            componentDatabase[componentType].forEach(component => {
                const option = document.createElement('option');
                option.value = component.id;
                option.textContent = `${component.name} - $${component.price}`;
                dropdown.appendChild(option);
            });
        }
    });
}

// Setup event listeners for component selection
function setupEventListeners() {
    // Component selection listeners
    Object.keys(componentDatabase).forEach(componentType => {
        const dropdown = document.getElementById(`${componentType}-select`);
        if (dropdown) {
            dropdown.addEventListener('change', function() {
                handleComponentSelection(componentType, this.value);
            });
        }
    });
    
    // Clear build button
    const clearBtn = document.getElementById('clear-build');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearBuild);
    }
}

// Handle component selection
function handleComponentSelection(componentType, componentId) {
    if (componentId) {
        const component = componentDatabase[componentType].find(c => c.id === componentId);
        currentBuild[componentType] = component;
        
        // Update price display
        const priceElement = document.getElementById(`${componentType}-price`);
        if (priceElement && component) {
            priceElement.textContent = `$${component.price}`;
        }
        
        // Show component in 3D visualization
        showBuilderComponent(componentType);
    } else {
        currentBuild[componentType] = null;
        const priceElement = document.getElementById(`${componentType}-price`);
        if (priceElement) {
            priceElement.textContent = '$0';
        }
        hideBuilderComponent(componentType);
    }
    
    updateTotalCost();
    updateFPSEstimates();
}

// Show component in 3D builder visualization
function showBuilderComponent(componentType) {
    const componentElement = document.getElementById(`builder-${componentType === 'motherboard' ? 'mb' : componentType}`);
    if (componentElement) {
        componentElement.style.display = 'block';
        componentElement.style.opacity = '0';
        componentElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            componentElement.style.transition = 'all 0.5s ease';
            componentElement.style.opacity = '1';
            componentElement.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Hide component in 3D builder visualization
function hideBuilderComponent(componentType) {
    const componentElement = document.getElementById(`builder-${componentType === 'motherboard' ? 'mb' : componentType}`);
    if (componentElement) {
        componentElement.style.opacity = '0';
        componentElement.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            componentElement.style.display = 'none';
        }, 500);
    }
}

// Update total cost calculation
function updateTotalCost() {
    let totalCost = 0;
    
    Object.values(currentBuild).forEach(component => {
        if (component) {
            totalCost += component.price;
        }
    });
    
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${totalCost.toLocaleString()}`;
        
        // Add animation effect
        totalPriceElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalPriceElement.style.transform = 'scale(1)';
        }, 200);
    }
}

// Calculate and update FPS estimates
function updateFPSEstimates() {
    const games = ['fortnite', 'apex', 'csgo'];
    
    games.forEach(game => {
        const fps = calculateGameFPS(game);
        const fpsElement = document.getElementById(`${game}-fps`);
        if (fpsElement) {
            if (fps > 0) {
                fpsElement.textContent = `${Math.round(fps)} FPS`;
                fpsElement.style.color = getFPSColor(fps);
            } else {
                fpsElement.textContent = '-- FPS';
                fpsElement.style.color = '#64748b';
            }
        }
    });
}

// Calculate FPS for a specific game
function calculateGameFPS(game) {
    const { cpu, gpu, ram } = currentBuild;
    
    // Need at least CPU and GPU for FPS calculation
    if (!cpu || !gpu) return 0;
    
    const gameData = fpsDatabase[game];
    if (!gameData) return 0;
    
    // Get base FPS from GPU tier
    let baseFps = gameData.baseFps[gpu.tier] || 0;
    
    // Apply CPU performance modifier
    const cpuModifier = 1 + ((cpu.performance - 80) / 100) * gameData.cpuMultiplier;
    baseFps *= cpuModifier;
    
    // Apply RAM performance modifier (if RAM is selected)
    if (ram) {
        const ramModifier = 1 + ((ram.speed - 3200) / 3200) * gameData.ramMultiplier;
        baseFps *= ramModifier;
        
        // Bonus for adequate RAM capacity
        if (ram.capacity >= 16) {
            baseFps *= 1.05;
        }
        if (ram.capacity >= 32) {
            baseFps *= 1.02;
        }
    }
    
    // Apply GPU performance scaling within tier
    const gpuScaling = gpu.performance / 100;
    baseFps *= (0.8 + 0.4 * gpuScaling); // Scale between 80% and 120% of base
    
    return Math.max(baseFps, 0);
}

// Get color based on FPS value
function getFPSColor(fps) {
    if (fps >= 120) return '#48bb78'; // Green - Excellent
    if (fps >= 60) return '#ed8936';  // Orange - Good
    if (fps >= 30) return '#e53e3e';  // Red - Playable
    return '#64748b'; // Gray - Poor
}

// Clear the entire build
function clearBuild() {
    // Reset current build
    Object.keys(currentBuild).forEach(componentType => {
        currentBuild[componentType] = null;
        
        // Reset dropdowns
        const dropdown = document.getElementById(`${componentType}-select`);
        if (dropdown) {
            dropdown.value = '';
        }
        
        // Reset price displays
        const priceElement = document.getElementById(`${componentType}-price`);
        if (priceElement) {
            priceElement.textContent = '$0';
        }
        
        // Hide 3D components
        hideBuilderComponent(componentType);
    });
    
    updateTotalCost();
    updateFPSEstimates();
    
    // Add visual feedback
    const clearBtn = document.getElementById('clear-build');
    if (clearBtn) {
        clearBtn.textContent = '✅ Cleared!';
        setTimeout(() => {
            clearBtn.textContent = '🗑️ Clear Build';
        }, 1500);
    }
}

// Enhanced section navigation to include PC Builder
function showBuilderSection() {
    showSection('builder');
    
    // Initialize builder if not already done
    if (!document.querySelector('#cpu-select option[value]')) {
        setTimeout(initializePCBuilder, 100);
    }
}

// Add PC Builder to scroll navigation
const originalScrollToSection = scrollToSection;
function scrollToSection(sectionId) {
    if (sectionId === 'builder') {
        showBuilderSection();
    } else {
        originalScrollToSection(sectionId);
    }
}

// Initialize PC Builder when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are ready
    setTimeout(() => {
        if (document.getElementById('cpu-select')) {
            initializePCBuilder();
        }
    }, 500);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        toggleFunFact,
        scrollToSection,
        showPCInterior,
        initializePCBuilder,
        handleComponentSelection,
        calculateGameFPS,
        clearBuild
    };
}
