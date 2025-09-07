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

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showSection,
        toggleFunFact,
        scrollToSection,
        showPCInterior
    };
}
