// Tunisia with Sammy - COMPLETELY FIXED VERSION
// All admin edits save immediately and show for users
// 3-day combinations work perfectly

class TunisiaWithSammy {
    constructor() {
        this.supabase = null;
        this.isAuthenticated = false;
        this.currentUser = null;
        this.selectedCities = [];
        this.currentPackageType = '';
        this.isAdmin = false;
        this.facebookGroupUrl = 'https://www.facebook.com/share/g/1Fw32ng2ep/';
        this.init();
    }

    async init() {
        await this.initializeSupabase();
        this.initializeElements();
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeCarousel();
        await this.checkAuthState();
        this.initializeScrollReveal();
    }

    async initializeSupabase() {
        try {
            this.supabase = supabase.createClient(
                'https://zukecbsifxztidfdhglu.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1a2VjYnNpZnh6dGlkZmRoZ2x1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzA0MzYsImV4cCI6MjA3NzkwNjQzNn0.2yvYdgNRUQfZ7WQhVzOfgQSCUsoYunzlThcmSy7-Vz8'
            );
            console.log('✅ Supabase initialized successfully');
        } catch (error) {
            console.error('❌ Supabase initialization failed:', error);
        }
    }

    initializeElements() {
        // Navigation elements
        this.loginBtn = document.getElementById('loginBtn');
        this.mobileLoginBtn = document.getElementById('mobileLoginBtn');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.adminBtn = document.getElementById('adminBtn');
        this.mobileAdminBtn = document.getElementById('mobileAdminBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

        // Hero elements
        this.heroCtaBtn = document.getElementById('heroCtaBtn');
        this.learnMoreBtn = document.getElementById('learnMoreBtn');

        // Authentication modal elements
        this.authModal = document.getElementById('authModal');
        this.closeModal = document.getElementById('closeModal');
        this.authForm = document.getElementById('authForm');
        this.authToggleBtn = document.getElementById('authToggleBtn');
        
        // Auth form elements
        this.authModalTitle = document.getElementById('authModalTitle');
        this.authModalSubtitle = document.getElementById('authModalSubtitle');
        this.nameField = document.getElementById('nameField');
        this.authName = document.getElementById('authName');
        this.authEmail = document.getElementById('authEmail');
        this.authPassword = document.getElementById('authPassword');
        this.confirmPasswordField = document.getElementById('confirmPasswordField');
        this.authConfirmPassword = document.getElementById('authConfirmPassword');
        this.authSubmitBtn = document.getElementById('authSubmitBtn');
        this.authToggleText = document.getElementById('authToggleText');

        // Dashboard elements
        this.dashboard = document.getElementById('dashboard');
        this.exploreItineraries = document.getElementById('exploreItineraries');
        this.joinCommunity = document.getElementById('joinCommunity');

        // City selection modal elements
        this.citySelectionModal = document.getElementById('citySelectionModal');
        this.closeCitySelectionModal = document.getElementById('closeCitySelectionModal');
        this.citySelectionTitle = document.getElementById('citySelectionTitle');
        this.citySelectionContent = document.getElementById('citySelectionContent');
        this.confirmCitySelection = document.getElementById('confirmCitySelection');

        // Package modal elements
        this.packageModal = document.getElementById('packageModal');
        this.closePackageModal = document.getElementById('closePackageModal');
        this.packageTitle = document.getElementById('packageTitle');
        this.packageContent = document.getElementById('packageContent');

        // Admin panel elements
        this.adminPanelModal = document.getElementById('adminPanelModal');
        this.closeAdminPanel = document.getElementById('closeAdminPanel');
        this.adminTabContent = document.getElementById('adminTabContent');

        console.log('✅ Elements initialized successfully');
    }

    setupEventListeners() {
        // Navigation event listeners
        this.loginBtn?.addEventListener('click', () => this.showAuthModal());
        this.mobileLoginBtn?.addEventListener('click', () => this.showAuthModal());
        this.mobileMenuBtn?.addEventListener('click', () => this.toggleMobileMenu());
        this.adminBtn?.addEventListener('click', () => this.showAdminPanel());
        this.mobileAdminBtn?.addEventListener('click', () => this.showAdminPanel());
        this.logoutBtn?.addEventListener('click', () => this.handleLogout());
        this.mobileLogoutBtn?.addEventListener('click', () => this.handleLogout());

        // Hero event listeners
        this.heroCtaBtn?.addEventListener('click', () => this.showAuthModal());
        this.learnMoreBtn?.addEventListener('click', () => this.scrollToSection('itineraries'));

        // Modal event listeners
        this.closeModal?.addEventListener('click', () => this.hideAuthModal());
        this.authModal?.addEventListener('click', (e) => {
            if (e.target === this.authModal) this.hideAuthModal();
        });

        // Auth form event listeners
        this.authForm?.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        this.authToggleBtn?.addEventListener('click', () => this.toggleAuthMode());

        // Dashboard event listeners
        this.exploreItineraries?.addEventListener('click', () => this.scrollToSection('itineraries'));
        this.joinCommunity?.addEventListener('click', () => this.joinFacebookGroup());

        // City selection modal event listeners
        this.closeCitySelectionModal?.addEventListener('click', () => this.hideCitySelectionModal());
        this.citySelectionModal?.addEventListener('click', (e) => {
            if (e.target === this.citySelectionModal) this.hideCitySelectionModal();
        });
        this.confirmCitySelection?.addEventListener('click', () => this.showPackageDetails());

        // Package modal event listeners
        this.closePackageModal?.addEventListener('click', () => this.hidePackageModal());
        this.packageModal?.addEventListener('click', (e) => {
            if (e.target === this.packageModal) this.hidePackageModal();
        });

        // Admin panel event listeners
        this.closeAdminPanel?.addEventListener('click', () => this.hideAdminPanel());
        this.adminPanelModal?.addEventListener('click', (e) => {
            if (e.target === this.adminPanelModal) this.hideAdminPanel();
        });

        // Package detail buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isAuthenticated) {
                    this.currentPackageType = e.target.getAttribute('data-package');
                    this.showAuthModal();
                    return;
                }
                const packageType = e.target.getAttribute('data-package');
                this.showCitySelection(packageType);
            });
        });

        // Community buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('join-community-btn')) {
                this.joinFacebookGroup();
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());

        // Facebook community button
        document.getElementById('joinFacebookGroup')?.addEventListener('click', () => this.joinFacebookGroup());

        // Admin tab buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-tab-btn')) {
                const tab = e.target.getAttribute('data-tab');
                this.handleAdminTabClick(tab, e.target);
            }
            
            if (e.target.classList.contains('save-itinerary-btn')) {
                const packageType = e.target.getAttribute('data-package-type');
                const cityCode = e.target.getAttribute('data-city-code');
                this.handleSaveItinerary(packageType, cityCode);
            }
        });
    }

    initializeAnimations() {
        // Typewriter effect for hero tagline
        if (typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: [
                    'Your Local Guide to Authentic Tunisian Experiences',
                    'Discover Hammamet, Sousse & Monastir',
                    'Free Self-Guided Itineraries',
                    'Experience Coastal Tunisia Like a Local'
                ],
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                loop: true,
                showCursor: false
            });
        }

        // Floating animation for hero elements
        this.animateFloatingElements();

        // Stagger animation for cards
        this.animateCards();
    }

    initializeCarousel() {
        if (typeof Splide !== 'undefined') {
            new Splide('#gallery-carousel', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 4000,
                pauseOnHover: true,
                breakpoints: {
                    768: {
                        perPage: 1,
                    },
                    1024: {
                        perPage: 2,
                    }
                }
            }).mount();
        }
    }

    initializeScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }

    animateFloatingElements() {
        if (typeof anime !== 'undefined') {
            anime({
                targets: '.floating-element',
                translateY: [-10, 10],
                duration: 3000,
                easing: 'easeInOutSine',
                direction: 'alternate',
                loop: true
            });
        }
    }

    animateCards() {
        if (typeof anime !== 'undefined') {
            const cards = document.querySelectorAll('.card-hover');
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        anime({
                            targets: entry.target,
                            translateY: [50, 0],
                            opacity: [0, 1],
                            duration: 800,
                            delay: index * 200,
                            easing: 'easeOutCubic'
                        });
                    }
                });
            });

            cards.forEach(card => cardObserver.observe(card));
        }
    }

    handleScroll() {
        const navbar = document.querySelector('nav');
        if (window.scrollY > 100) {
            navbar.classList.add('glass-effect');
        } else {
            navbar.classList.remove('glass-effect');
        }

        const hero = document.querySelector('.hero-bg');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    toggleMobileMenu() {
        this.mobileMenu.classList.toggle('hidden');
    }

    // Authentication Methods
    async checkAuthState() {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            
            if (session && session.user) {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                
                // Check if user is admin
                await this.checkAdminStatus();
                
                this.updateUIForAuthState();
                this.showDashboard();
            } else {
                this.isAuthenticated = false;
                this.isAdmin = false;
                this.currentUser = null;
                this.updateUIForAuthState();
                this.hideDashboard();
            }
        } catch (error) {
            console.error('Auth check error:', error);
            this.isAuthenticated = false;
            this.isAdmin = false;
            this.updateUIForAuthState();
        }
    }

    async checkAdminStatus() {
        if (!this.currentUser) return false;
        
        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', this.currentUser.id)
                .single();

            if (error) {
                console.error('Error checking admin status:', error);
                this.isAdmin = false;
                return false;
            }

            this.isAdmin = data?.is_admin || false;
            return this.isAdmin;
        } catch (error) {
            console.error('Admin check error:', error);
            this.isAdmin = false;
            return false;
        }
    }

    updateUIForAuthState() {
        const navbar = document.querySelector('nav');
        
        if (this.isAuthenticated) {
            // Hide login buttons
            if (this.loginBtn) this.loginBtn.classList.add('hidden');
            if (this.mobileLoginBtn) this.mobileLoginBtn.classList.add('hidden');
            
            // Show logout buttons
            if (this.logoutBtn) this.logoutBtn.classList.remove('hidden');
            if (this.mobileLogoutBtn) this.mobileLogoutBtn.classList.remove('hidden');
            
            // Only show admin buttons if user is admin
            if (this.isAdmin) {
                if (this.adminBtn) this.adminBtn.classList.remove('hidden');
                if (this.mobileAdminBtn) this.mobileAdminBtn.classList.remove('hidden');
            } else {
                if (this.adminBtn) this.adminBtn.classList.add('hidden');
                if (this.mobileAdminBtn) this.mobileAdminBtn.classList.add('hidden');
            }

            // Add logged-in class to navbar for color changes
            navbar.classList.add('logged-in');
            
        } else {
            // Show login buttons
            if (this.loginBtn) this.loginBtn.classList.remove('hidden');
            if (this.mobileLoginBtn) this.mobileLoginBtn.classList.remove('hidden');
            
            // Hide logout buttons
            if (this.logoutBtn) this.logoutBtn.classList.add('hidden');
            if (this.mobileLogoutBtn) this.mobileLogoutBtn.classList.add('hidden');
            
            // Hide admin buttons
            if (this.adminBtn) this.adminBtn.classList.add('hidden');
            if (this.mobileAdminBtn) this.mobileAdminBtn.classList.add('hidden');

            // Remove logged-in class from navbar
            navbar.classList.remove('logged-in');
        }
    }

    showAuthModal() {
        this.resetAuthForm();
        this.authModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    hideAuthModal() {
        this.authModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    resetAuthForm() {
        this.authModalTitle.textContent = 'Welcome Back';
        this.authModalSubtitle.textContent = 'Sign in to access free itineraries';
        this.nameField.classList.add('hidden');
        this.confirmPasswordField.classList.add('hidden');
        this.authSubmitBtn.textContent = 'Sign In';
        this.authToggleText.innerHTML = 'Don\'t have an account? <button id="authToggleBtn" class="text-blue-600 hover:text-blue-500 font-medium">Sign up</button>';
        this.authForm.reset();
        
        // Re-attach event listener
        const newToggleBtn = document.getElementById('authToggleBtn');
        if (newToggleBtn) {
            newToggleBtn.addEventListener('click', () => this.toggleAuthMode());
        }
    }

    toggleAuthMode() {
        const isLogin = this.authModalTitle.textContent === 'Welcome Back';
        
        if (isLogin) {
            this.authModalTitle.textContent = 'Create Account';
            this.authModalSubtitle.textContent = 'Join our travel community';
            this.nameField.classList.remove('hidden');
            this.confirmPasswordField.classList.remove('hidden');
            this.authSubmitBtn.textContent = 'Sign Up';
            this.authToggleText.innerHTML = 'Already have an account? <button id="authToggleBtn" class="text-blue-600 hover:text-blue-500 font-medium">Sign in</button>';
        } else {
            this.authModalTitle.textContent = 'Welcome Back';
            this.authModalSubtitle.textContent = 'Sign in to access free itineraries';
            this.nameField.classList.add('hidden');
            this.confirmPasswordField.classList.add('hidden');
            this.authSubmitBtn.textContent = 'Sign In';
            this.authToggleText.innerHTML = 'Don\'t have an account? <button id="authToggleBtn" class="text-blue-600 hover:text-blue-500 font-medium">Sign up</button>';
        }
        
        // Re-attach event listener
        const newToggleBtn = document.getElementById('authToggleBtn');
        if (newToggleBtn) {
            newToggleBtn.addEventListener('click', () => this.toggleAuthMode());
        }
    }

    async handleAuthSubmit(e) {
        e.preventDefault();
        
        const isSignup = this.authModalTitle.textContent === 'Create Account';
        const email = this.authEmail.value;
        const password = this.authPassword.value;
        const name = this.authName?.value || '';
        const confirmPassword = this.authConfirmPassword?.value || '';

        if (isSignup) {
            if (!name) {
                this.showErrorMessage('Please enter your full name');
                return;
            }
            if (password !== confirmPassword) {
                this.showErrorMessage('Passwords do not match');
                return;
            }
            if (password.length < 6) {
                this.showErrorMessage('Password must be at least 6 characters long');
                return;
            }
        }

        this.showLoadingState();

        try {
            if (isSignup) {
                const { data, error } = await this.supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: {
                            full_name: name
                        }
                    }
                });

                if (error) throw error;

                this.showSuccessMessage('Account created successfully! Please check your email for verification.');
                this.hideAuthModal();
                
            } else {
                const { data, error } = await this.supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                this.currentUser = data.user;
                this.isAuthenticated = true;
                await this.checkAdminStatus();
                this.updateUIForAuthState();
                this.showSuccessMessage('Welcome back!');
                this.hideAuthModal();
                this.showDashboard();
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showErrorMessage(error.message || 'Authentication failed. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }

    async handleLogout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;

            this.isAuthenticated = false;
            this.currentUser = null;
            this.isAdmin = false;
            this.updateUIForAuthState();
            this.hideDashboard();
            
            this.showSuccessMessage('Logged out successfully!');
        } catch (error) {
            console.error('Logout error:', error);
            this.showErrorMessage('Logout failed. Please try again.');
        }
    }

    showDashboard() {
        const hero = document.getElementById('home');
        const dashboard = document.getElementById('dashboard');
        
        if (hero && dashboard) {
            hero.style.display = 'none';
            dashboard.classList.remove('hidden');
        }
    }

    hideDashboard() {
        const hero = document.getElementById('home');
        const dashboard = document.getElementById('dashboard');
        
        if (hero && dashboard) {
            hero.style.display = 'flex';
            dashboard.classList.add('hidden');
        }
    }

    joinFacebookGroup() {
        window.open(this.facebookGroupUrl, '_blank');
        this.showSuccessMessage('Redirecting to our Facebook community!');
    }

    // Enhanced Itinerary Methods - COMPLETELY FIXED
    showCitySelection(packageType) {
        if (!this.isAuthenticated) {
            this.showAuthModal();
            return;
        }

        this.currentPackageType = packageType;
        this.selectedCities = [];
        
        const packageTitles = {
            '1day': '1-Day Experience - Choose Your City',
            '3day': '3-Day Getaway - Choose Your Cities (2-3 cities)', 
            '7day': '7-Day Adventure - Complete Coastal Experience'
        };

        this.citySelectionTitle.textContent = packageTitles[packageType] || 'Choose Your Destination';
        
        if (packageType === '1day') {
            this.renderSingleCitySelection();
        } else if (packageType === '3day') {
            this.renderMultiCitySelection();
        } else if (packageType === '7day') {
            this.selectedCities = ['hammamet', 'sousse', 'monastir'];
            this.showPackageDetails();
            return;
        }

        this.citySelectionModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    renderSingleCitySelection() {
        const cities = [
            { id: 'hammamet', name: 'Hammamet', emoji: '🏖️', description: 'Golden beaches & vibrant medina' },
            { id: 'sousse', name: 'Sousse', emoji: '🏛️', description: 'UNESCO heritage & ancient history' },
            { id: 'monastir', name: 'Monastir', emoji: '🕌', description: 'Historic landmarks & coastal charm' }
        ];

        this.citySelectionContent.innerHTML = `
            <div class="grid md:grid-cols-3 gap-6">
                ${cities.map(city => `
                    <div class="city-option bg-white border-2 border-gray-200 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-lg" data-city="${city.id}">
                        <div class="text-4xl mb-3">${city.emoji}</div>
                        <h3 class="font-display text-xl font-bold text-gray-800 mb-2">${city.name}</h3>
                        <p class="text-gray-600 text-sm">${city.description}</p>
                    </div>
                `).join('')}
            </div>
        `;

        this.citySelectionContent.querySelectorAll('.city-option').forEach(option => {
            option.addEventListener('click', () => {
                this.citySelectionContent.querySelectorAll('.city-option').forEach(opt => {
                    opt.classList.remove('selected', 'bg-blue-50', 'border-blue-500');
                });
                
                option.classList.add('selected', 'bg-blue-50', 'border-blue-500');
                this.selectedCities = [option.getAttribute('data-city')];
                this.confirmCitySelection.disabled = false;
                this.confirmCitySelection.classList.remove('opacity-50', 'cursor-not-allowed');
            });
        });

        this.confirmCitySelection.disabled = true;
        this.confirmCitySelection.classList.add('opacity-50', 'cursor-not-allowed');
    }

    renderMultiCitySelection() {
        const cities = [
            { id: 'hammamet', name: 'Hammamet', emoji: '🏖️', description: 'Beach paradise' },
            { id: 'sousse', name: 'Sousse', emoji: '🏛️', description: 'Ancient history' },
            { id: 'monastir', name: 'Monastir', emoji: '🕌', description: 'Coastal heritage' }
        ];

        this.citySelectionContent.innerHTML = `
            <div class="text-center mb-6">
                <p class="text-gray-600">Select 2-3 cities for your 3-day adventure. Different combinations create unique experiences!</p>
            </div>
            <div class="grid md:grid-cols-3 gap-6">
                ${cities.map(city => `
                    <div class="city-option bg-white border-2 border-gray-200 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-lg" data-city="${city.id}">
                        <div class="text-4xl mb-3">${city.emoji}</div>
                        <h3 class="font-display text-xl font-bold text-gray-800 mb-2">${city.name}</h3>
                        <p class="text-gray-600 text-sm">${city.description}</p>
                        <div class="mt-3">
                            <input type="checkbox" class="city-checkbox hidden" data-city="${city.id}">
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600" id="selectionCount">Selected: 0 cities</p>
                <p class="text-xs text-blue-600 mt-2" id="combinationHint"></p>
            </div>
        `;

        this.updateCombinationHint();

        this.citySelectionContent.querySelectorAll('.city-option').forEach(option => {
            option.addEventListener('click', () => {
                const cityId = option.getAttribute('data-city');
                const checkbox = option.querySelector('.city-checkbox');
                
                if (this.selectedCities.includes(cityId)) {
                    this.selectedCities = this.selectedCities.filter(c => c !== cityId);
                    option.classList.remove('selected', 'bg-blue-50', 'border-blue-500');
                    checkbox.checked = false;
                } else {
                    if (this.selectedCities.length < 3) {
                        this.selectedCities.push(cityId);
                        option.classList.add('selected', 'bg-blue-50', 'border-blue-500');
                        checkbox.checked = true;
                    }
                }
                
                document.getElementById('selectionCount').textContent = `Selected: ${this.selectedCities.length} cities`;
                this.updateCombinationHint();
                this.confirmCitySelection.disabled = this.selectedCities.length < 2;
                this.confirmCitySelection.classList.toggle('opacity-50', this.selectedCities.length < 2);
                this.confirmCitySelection.classList.toggle('cursor-not-allowed', this.selectedCities.length < 2);
            });
        });

        this.confirmCitySelection.disabled = true;
        this.confirmCitySelection.classList.add('opacity-50', 'cursor-not-allowed');
    }

    updateCombinationHint() {
        const hintElement = document.getElementById('combinationHint');
        const sortedCities = [...this.selectedCities].sort();
        
        const combinations = {
            'hammamet,sousse': '🏖️ Beach & History (Hammamet + Sousse)',
            'hammamet,monastir': '🌊 Coastal Escape (Hammamet + Monastir)',
            'sousse,monastir': '🏛️ Historic Journey (Sousse + Monastir)',
            'hammamet,sousse,monastir': '🌟 Complete Coastal Experience (All 3 Cities)'
        };

        const combinationKey = sortedCities.join(',');
        const hint = combinations[combinationKey] || 'Choose 2-3 cities to see your adventure combination';

        hintElement.textContent = hint;
    }

    hideCitySelectionModal() {
        this.citySelectionModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    async showPackageDetails() {
        this.hideCitySelectionModal();
        await this.loadPackageDetails();
    }

    async loadPackageDetails() {
        try {
            const packageData = await this.generatePackageData(this.currentPackageType, this.selectedCities);
            
            if (packageData) {
                this.packageTitle.textContent = packageData.title;
                this.packageContent.innerHTML = packageData.content;
                this.packageModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        } catch (error) {
            console.error('Error loading package details:', error);
            this.showErrorMessage('Failed to load itinerary details. Please try again.');
        }
    }

    async generatePackageData(packageType, selectedCities) {
        try {
            // Always fetch fresh data from database
            const { data: itineraries, error } = await this.supabase
                .from('itineraries')
                .select('*')
                .eq('package_type', packageType)
                .eq('is_active', true);

            if (error) {
                console.error('Database error:', error);
                return this.getLocalPackageData(packageType, selectedCities);
            }

            let itinerary;
            
            if (packageType === '1day' && selectedCities.length === 1) {
                itinerary = itineraries.find(i => i.city_code === selectedCities[0]);
            } else if (packageType === '3day') {
                // Fixed 3-day logic with proper city combinations
                itinerary = this.find3DayItinerary(itineraries, selectedCities);
            } else if (packageType === '7day') {
                itinerary = itineraries.find(i => i.city_code === 'complete') || itineraries[0];
            }

            if (itinerary) {
                console.log('✅ Found itinerary:', itinerary);
                return this.formatDatabaseItinerary(itinerary, packageType, selectedCities);
            } else {
                console.log('❌ No itinerary found, using fallback');
                return this.getLocalPackageData(packageType, selectedCities);
            }
            
        } catch (error) {
            console.error('Error generating package data:', error);
            return this.getLocalPackageData(packageType, selectedCities);
        }
    }

    find3DayItinerary(itineraries, selectedCities) {
        const sortedCities = [...selectedCities].sort();
        const combination = sortedCities.join(',');

        // Map city combinations to database city_codes
        const combinationMap = {
            'hammamet,sousse': 'hammamet-sousse',
            'hammamet,monastir': 'hammamet-monastir',
            'sousse,monastir': 'sousse-monastir',
            'hammamet,sousse,monastir': 'all-cities'
        };

        const cityCode = combinationMap[combination];
        
        if (cityCode) {
            const foundItinerary = itineraries.find(i => i.city_code === cityCode);
            console.log('🔍 Looking for 3-day itinerary:', cityCode, 'Found:', !!foundItinerary);
            return foundItinerary;
        }

        return itineraries[0]; // Fallback
    }

    formatDatabaseItinerary(itinerary, packageType, selectedCities) {
        const cityNames = {
            'hammamet': 'Hammamet', 'sousse': 'Sousse', 'monastir': 'Monastir',
            'hammamet-sousse': 'Hammamet & Sousse', 'hammamet-monastir': 'Hammamet & Monastir',
            'sousse-monastir': 'Sousse & Monastir', 'all-cities': 'All Coastal Cities', 
            'complete': 'Complete Coastal Experience'
        };

        const selectedCityNames = selectedCities.map(city => cityNames[city] || city);
        const citiesText = selectedCityNames.join(' & ');

        const highlights = itinerary.highlights || [];
        const schedule = itinerary.schedule || {};

        // Image paths
        const cityImages = {
            'hammamet': 'istockphoto-1458724784-612x612.jpg',
            'sousse': 'medina-of-sousse2.webp',
            'monastir': 'Ribat-of-Monastir-833x1024.jpg',
            'default': 'hero-banner.jpg'
        };

        const imagePath = `./resources/${cityImages[selectedCities[0]] || cityImages['default']}`;

        return {
            title: itinerary.title,
            content: `
                <div class="space-y-6">
                    <div class="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-blue-800 text-center">🎯 Your Selected Cities: ${citiesText}</h3>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <img src="${imagePath}" alt="${itinerary.title}" class="w-full h-64 object-cover rounded-lg mb-4">
                            <h3 class="text-2xl font-bold mb-4">${itinerary.title}</h3>
                            <p class="text-gray-600 mb-6">${itinerary.description}</p>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">🌟 Experience Highlights</h4>
                            <ul class="space-y-3 mb-6">
                                ${highlights.map(highlight => `
                                    <li class="flex items-start">
                                        <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                        <span class="text-gray-700">${highlight}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                    
                    ${this.formatScheduleSection(schedule, packageType, selectedCities)}
                    
                    <div class="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <h4 class="text-xl font-bold mb-4 text-center text-orange-800">🎉 Free Self-Guided Itinerary</h4>
                        <p class="text-center text-orange-700 mb-4">
                            This is a completely free itinerary created by Sammy, your local Tunisia expert. 
                            Explore at your own pace and discover authentic experiences that most tourists miss.
                        </p>
                        <div class="text-center">
                            <button class="join-community-btn btn-primary text-white px-8 py-3 rounded-full font-semibold">
                                Join Our Community for More Tips
                            </button>
                        </div>
                    </div>
                </div>
            `
        };
    }

    formatScheduleSection(schedule, packageType, selectedCities) {
        // If schedule is empty or invalid, return default schedule
        if (!schedule || typeof schedule !== 'object') {
            return this.getDefaultSchedule(packageType, selectedCities);
        }

        // Determine colors based on package type
        let colors;
        switch(packageType) {
            case '1day':
                colors = {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200', 
                    text: 'text-blue-800',
                    badge: 'bg-blue-500'
                };
                break;
            case '3day':
                colors = {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-800', 
                    badge: 'bg-green-500'
                };
                break;
            case '7day':
                colors = {
                    bg: 'bg-purple-50',
                    border: 'border-purple-200',
                    text: 'text-purple-800',
                    badge: 'bg-purple-500'
                };
                break;
            default:
                colors = {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    badge: 'bg-blue-500'
                };
        }

        // Check if we have schedule text
        if (schedule.text && schedule.text.trim()) {
            return `
                <div class="${colors.bg} p-6 rounded-lg border ${colors.border}">
                    <h4 class="text-xl font-bold mb-4 ${colors.text}">📅 Your ${packageType === '1day' ? 'Daily' : packageType === '3day' ? '3-Day' : '7-Day'} Schedule</h4>
                    <div class="bg-white p-4 rounded-lg border ${colors.border}">
                        <pre class="whitespace-pre-wrap font-sans text-sm ${colors.text}">${schedule.text}</pre>
                    </div>
                </div>
            `;
        }

        // Return empty if no schedule data
        return this.getDefaultSchedule(packageType, selectedCities);
    }

    getDefaultSchedule(packageType, selectedCities) {
        let colors;
        switch(packageType) {
            case '1day':
                colors = {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    badge: 'bg-blue-500'
                };
                break;
            case '3day':
                colors = {
                    bg: 'bg-green-50', 
                    border: 'border-green-200',
                    text: 'text-green-800',
                    badge: 'bg-green-500'
                };
                break;
            case '7day':
                colors = {
                    bg: 'bg-purple-50',
                    border: 'border-purple-200',
                    text: 'text-purple-800', 
                    badge: 'bg-purple-500'
                };
                break;
            default:
                colors = {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    badge: 'bg-blue-500'
                };
        }

        if (packageType === '1day') {
            return `
                <div class="${colors.bg} p-6 rounded-lg border ${colors.border}">
                    <h4 class="text-xl font-bold mb-4 ${colors.text}">📅 Your Daily Schedule</h4>
                    <div class="space-y-4">
                        <div class="bg-white p-4 rounded-lg border ${colors.border}">
                            <div class="flex items-center mb-2">
                                <span class="${colors.badge} text-white px-3 py-1 rounded-full text-sm font-bold mr-3">Morning</span>
                                <h5 class="font-bold ${colors.text}">Arrival & First Exploration</h5>
                            </div>
                            <p class="${colors.text}">Start your day with arrival and initial exploration of the city's main attractions.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg border ${colors.border}">
                            <div class="flex items-center mb-2">
                                <span class="${colors.badge} text-white px-3 py-1 rounded-full text-sm font-bold mr-3">Afternoon</span>
                                <h5 class="font-bold ${colors.text}">Cultural Immersion</h5>
                            </div>
                            <p class="${colors.text}">Experience local culture, visit historical sites, and enjoy authentic cuisine.</p>
                        </div>
                        <div class="bg-white p-4 rounded-lg border ${colors.border}">
                            <div class="flex items-center mb-2">
                                <span class="${colors.badge} text-white px-3 py-1 rounded-full text-sm font-bold mr-3">Evening</span>
                                <h5 class="font-bold ${colors.text}">Relaxation & Departure</h5>
                            </div>
                            <p class="${colors.text}">Evening relaxation, souvenir shopping, and departure preparations.</p>
                        </div>
                    </div>
                </div>
            `;
        }

        // Return empty if no schedule data
        return '';
    }

    getLocalPackageData(packageType, selectedCities) {
        // Fallback data - this should rarely be used now
        const cityNames = {
            'hammamet': 'Hammamet', 'sousse': 'Sousse', 'monastir': 'Monastir'
        };

        const selectedCityNames = selectedCities.map(city => cityNames[city]);
        const citiesText = selectedCityNames.join(' & ');

        if (packageType === '1day') {
            return this.getFallback1DayItinerary(selectedCities[0], selectedCityNames[0]);
        } else if (packageType === '3day') {
            return this.get3DayItinerary(selectedCities, citiesText);
        } else if (packageType === '7day') {
            return this.get7DayItinerary();
        }

        return null;
    }

    get3DayItinerary(selectedCities, citiesText) {
        const imagePath = './resources/0f7b0b0e3649cc138aa80f90aef4990322b555fe (1).jpg';

        return {
            title: `3-Day ${citiesText} Adventure`,
            content: `
                <div class="space-y-6">
                    <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-green-800 text-center">🎯 Custom 3-Day Itinerary for ${citiesText}</h3>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <img src="${imagePath}" alt="${citiesText}" class="w-full h-64 object-cover rounded-lg mb-4">
                            <h3 class="text-2xl font-bold mb-4">Your 3-Day ${citiesText} Journey</h3>
                            <p class="text-gray-600 mb-6">
                                Experience the perfect blend of coastal beauty and cultural richness across ${citiesText}. 
                                This carefully crafted itinerary ensures you see the best of each city while traveling at a comfortable pace.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">🌟 What's Included:</h4>
                            <ul class="space-y-3 mb-6">
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Beach relaxation and Mediterranean swimming experiences</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">UNESCO World Heritage site exploration</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Historic fortress and medina visits</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Authentic Tunisian cuisine experiences</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Local market shopping and cultural immersion</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h4 class="text-xl font-bold mb-4 text-green-800">📅 3-Day Adventure Schedule</h4>
                        <div class="space-y-4">
                            <div class="bg-white p-4 rounded-lg border border-green-200">
                                <div class="flex items-center mb-2">
                                    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">Day 1</span>
                                    <h5 class="font-bold text-green-700">${selectedCities[0] ? this.formatCityName(selectedCities[0]) : 'Arrival & First City'}</h5>
                                </div>
                                <p class="text-green-800">Arrive in your first coastal city, check into accommodation, initial exploration, beach relaxation, and evening medina discovery.</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg border border-green-200">
                                <div class="flex items-center mb-2">
                                    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">Day 2</span>
                                    <h5 class="font-bold text-green-700">${selectedCities[1] ? this.formatCityName(selectedCities[1]) : 'Second City & Culture'}</h5>
                                </div>
                                <p class="text-green-800">Travel to your second city, explore historic sites, visit local markets, enjoy authentic dining, and cultural activities.</p>
                            </div>
                            <div class="bg-white p-4 rounded-lg border border-green-200">
                                <div class="flex items-center mb-2">
                                    <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">Day 3</span>
                                    <h5 class="font-bold text-green-700">${selectedCities[2] ? this.formatCityName(selectedCities[2]) : 'Final Exploration'}</h5>
                                </div>
                                <p class="text-green-800">Explore your final city or return to favorite spots, marina visits, souvenir shopping, and departure preparations.</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <h4 class="text-xl font-bold mb-4 text-center text-orange-800">🎉 Free Self-Guided Itinerary</h4>
                        <p class="text-center text-orange-700 mb-4">
                            This is a completely free itinerary created by Sammy, your local Tunisia expert. 
                            Explore at your own pace and discover authentic experiences that most tourists miss.
                        </p>
                        <div class="text-center">
                            <button class="join-community-btn btn-primary text-white px-8 py-3 rounded-full font-semibold">
                                Join Our Community for More Tips
                            </button>
                        </div>
                    </div>
                </div>
            `
        };
    }

    get7DayItinerary() {
        const imagePath = './resources/80d0d1d3b7b8dbb70279cdaf63f318fada387dbb.jpeg';

        return {
            title: '7-Day Ultimate Tunisian Coastal Journey',
            content: `
                <div class="space-y-6">
                    <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-purple-800 text-center">🌟 Complete 7-Day Coastal Experience</h3>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <img src="${imagePath}" alt="7 Day Adventure" class="w-full h-64 object-cover rounded-lg mb-4">
                            <h3 class="text-2xl font-bold mb-4">Your Ultimate Tunisian Journey</h3>
                            <p class="text-gray-600 mb-6">
                                Experience the complete beauty of Tunisia's coast with this comprehensive 7-day adventure. 
                                From Mediterranean beaches to ancient history, immerse yourself in authentic Tunisian culture 
                                across all three coastal cities at a perfect, relaxed pace.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">🎯 Comprehensive Experience Includes:</h4>
                            <ul class="space-y-3 mb-6">
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Complete exploration</strong> of Hammamet, Sousse, and Monastir</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>UNESCO World Heritage</strong> site visits and guided exploration</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Mediterranean beach</strong> experiences and water activities</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Historic fortress and mausoleum</strong> exploration</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Authentic local cuisine</strong> and dining experiences</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Cultural immersion</strong> and traditional market visits</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Professional photography</strong> spots and scenic viewpoints</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700"><strong>Local crafts</strong> and souvenir shopping guidance</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="bg-purple-50 p-6 rounded-lg border border-purple-200">
                        <h4 class="text-xl font-bold mb-4 text-purple-800">📅 Detailed 7-Day Itinerary</h4>
                        <div class="space-y-4">
                            ${[
                                ['Day 1', 'Hammamet Arrival', 'Arrival in Hammamet, beach relaxation, Medina introduction, Yasmine Marina evening walk'],
                                ['Day 2', 'Hammamet Exploration', 'Full city tour, local crafts exploration, traditional lunch, beach clubs, sunset photography'],
                                ['Day 3', 'Travel to Sousse', 'Morning travel to Sousse, UNESCO Medina exploration, Ribat fortress, traditional dinner in Medina'],
                                ['Day 4', 'Sousse Immersion', 'Archaeological Museum, Great Mosque, local markets, cultural experiences, authentic cuisine'],
                                ['Day 5', 'Sousse to Monastir', 'Travel to Monastir, historic Ribat exploration, Bourguiba Mausoleum, coastal photography'],
                                ['Day 6', 'Monastir Discovery', 'Marina exploration, local seafood lunch, optional day trips, souvenir shopping, farewell dinner'],
                                ['Day 7', 'Return Journey', 'Final shopping, favorite spot revisit, departure preparations, travel to airport']
                            ].map(day => `
                                <div class="bg-white p-4 rounded-lg border border-purple-200">
                                    <div class="flex items-center mb-2">
                                        <span class="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">${day[0]}</span>
                                        <h5 class="font-bold text-purple-700">${day[1]}</h5>
                                    </div>
                                    <p class="text-purple-800">${day[2]}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                        <h4 class="text-xl font-bold mb-4 text-center text-blue-800">💡 Pro Travel Tips</h4>
                        <div class="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                            <div>
                                <h5 class="font-bold mb-2">🏨 Accommodation</h5>
                                <p>Stay in central locations in each city for easy access to attractions</p>
                            </div>
                            <div>
                                <h5 class="font-bold mb-2">🚗 Transportation</h5>
                                <p>Use local trains or taxis between cities - affordable and convenient</p>
                            </div>
                            <div>
                                <h5 class="font-bold mb-2">🍽️ Dining</h5>
                                <p>Try local seafood and traditional Tunisian dishes at medina restaurants</p>
                            </div>
                            <div>
                                <h5 class="font-bold mb-2">📸 Photography</h5>
                                <p>Best light for photos: early morning and late afternoon golden hours</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <h4 class="text-xl font-bold mb-4 text-center text-orange-800">🎉 Free Self-Guided Itinerary</h4>
                        <p class="text-center text-orange-700 mb-4">
                            This is a completely free itinerary created by Sammy, your local Tunisia expert. 
                            Explore at your own pace and discover authentic experiences that most tourists miss.
                        </p>
                        <div class="text-center">
                            <button class="join-community-btn btn-primary text-white px-8 py-3 rounded-full font-semibold">
                                Join Our Community for More Tips
                            </button>
                        </div>
                    </div>
                </div>
            `
        };
    }

    getFallback1DayItinerary(cityCode, cityName) {
        const cityImages = {
            'hammamet': 'istockphoto-1458724784-612x612.jpg',
            'sousse': 'medina-of-sousse2.webp',
            'monastir': 'Ribat-of-Monastir-833x1024.jpg',
            'default': 'hero-banner.jpg'
        };

        const imagePath = `./resources/${cityImages[cityCode] || cityImages['default']}`;

        return {
            title: `1-Day ${cityName} Experience`,
            content: `
                <div class="space-y-6">
                    <div class="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-blue-800 text-center">🎯 1-Day ${cityName} Adventure</h3>
                    </div>

                    <div class="grid md:grid-cols-2 gap-8">
                        <div>
                            <img src="${imagePath}" alt="${cityName}" class="w-full h-64 object-cover rounded-lg mb-4">
                            <h3 class="text-2xl font-bold mb-4">Perfect Day in ${cityName}</h3>
                            <p class="text-gray-600 mb-6">
                                Experience the best of ${cityName} in one perfect day. This carefully crafted itinerary takes you through 
                                the most beautiful spots, authentic experiences, and hidden gems that make ${cityName} special.
                            </p>
                        </div>
                        <div>
                            <h4 class="text-xl font-bold mb-4">🌟 What's Included:</h4>
                            <ul class="space-y-3 mb-6">
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Beautiful beach relaxation and swimming</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Historic site exploration</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Authentic local cuisine experience</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Cultural immersion activities</span>
                                </li>
                                <li class="flex items-start">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                                    <span class="text-gray-700">Professional photography spots</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border border-orange-200">
                        <h4 class="text-xl font-bold mb-4 text-center text-orange-800">🎉 Free Self-Guided Itinerary</h4>
                        <p class="text-center text-orange-700 mb-4">
                            This is a completely free itinerary created by Sammy, your local Tunisia expert. 
                            Explore at your own pace and discover authentic experiences that most tourists miss.
                        </p>
                        <div class="text-center">
                            <button class="join-community-btn btn-primary text-white px-8 py-3 rounded-full font-semibold">
                                Join Our Community for More Tips
                            </button>
                        </div>
                    </div>
                </div>
            `
        };
    }

    formatCityName(cityCode) {
        const cityNames = {
            'hammamet': 'Hammamet Exploration',
            'sousse': 'Sousse Discovery', 
            'monastir': 'Monastir Adventure'
        };
        return cityNames[cityCode] || cityCode;
    }

    hidePackageModal() {
        this.packageModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // Enhanced Admin Panel Methods - COMPLETELY FIXED
    async showAdminPanel() {
        if (!this.isAdmin) {
            this.showErrorMessage('Access denied. Admin privileges required.');
            return;
        }

        this.adminPanelModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        await this.loadAdminContent('1day');
    }

    hideAdminPanel() {
        this.adminPanelModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    async handleAdminTabClick(tab, button) {
        const tabButtons = document.querySelectorAll('.admin-tab-btn');
        tabButtons.forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        button.classList.remove('bg-gray-200', 'text-gray-700');
        button.classList.add('bg-blue-600', 'text-white');
        
        await this.loadAdminContent(tab);
    }

    async loadAdminContent(tab) {
        try {
            let content = '';
            
            if (tab === '1day') {
                content = await this.get1DayAdminContent();
            } else if (tab === '3day') {
                content = await this.get3DayAdminContent();
            } else if (tab === '7day') {
                content = await this.get7DayAdminContent();
            }
            
            this.adminTabContent.innerHTML = content;
        } catch (error) {
            console.error('Error loading admin content:', error);
            this.adminTabContent.innerHTML = '<p class="text-red-500 p-4">Error loading content. Please try again.</p>';
        }
    }

    async get1DayAdminContent() {
        try {
            const { data: itineraries, error } = await this.supabase
                .from('itineraries')
                .select('*')
                .eq('package_type', '1day')
                .order('city_code');

            if (error) throw error;

            const cities = {
                'hammamet': { name: 'Hammamet', emoji: '🏖️', description: 'Beach & Medina Experience' },
                'sousse': { name: 'Sousse', emoji: '🏛️', description: 'UNESCO Heritage Tour' },
                'monastir': { name: 'Monastir', emoji: '🕌', description: 'Historic Landmarks Tour' }
            };

            return `
                <div class="space-y-6">
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-blue-800">1-Day Itineraries Management</h3>
                        <p class="text-blue-600 text-sm">Edit the detailed itineraries for each city</p>
                    </div>
                    ${Object.entries(cities).map(([code, city]) => {
                        const itinerary = itineraries?.find(i => i.city_code === code) || {};
                        const scheduleText = itinerary.schedule?.text || '';
                        const highlightsText = (itinerary.highlights || []).join('\n');
                        
                        return `
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <span class="text-2xl mr-3">${city.emoji}</span>
                                    <h3 class="text-xl font-bold text-gray-800">${city.name} - ${city.description}</h3>
                                </div>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Itinerary Title</label>
                                        <input type="text" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                               value="${itinerary.title || `1-Day ${city.name} Experience`}" 
                                               data-field="title" 
                                               data-city-code="${code}">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                  data-field="description" 
                                                  data-city-code="${code}">${itinerary.description || `Experience the best of ${city.name} in one perfect day. Discover beautiful beaches, historic sites, and authentic culture.`}</textarea>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Highlights (one per line)</label>
                                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                      data-field="highlights" 
                                                      data-city-code="${code}" 
                                                      placeholder="Beautiful beach relaxation
Historic site exploration
Authentic local cuisine">${highlightsText}</textarea>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Schedule (plain text)</label>
                                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                                                      data-field="schedule" 
                                                      data-city-code="${code}" 
                                                      placeholder="Morning: Arrival and beach
Afternoon: Medina exploration
Evening: Marina visit and dinner">${scheduleText}</textarea>
                                        </div>
                                    </div>
                                    <button class="save-itinerary-btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200" 
                                            data-package-type="1day" 
                                            data-city-code="${code}">
                                        💾 Save ${city.name} Itinerary
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error loading 1-day admin content:', error);
            return '<p class="text-red-500 p-4">Error loading 1-day itineraries. Please refresh and try again.</p>';
        }
    }

    async get3DayAdminContent() {
        try {
            const { data: itineraries, error } = await this.supabase
                .from('itineraries')
                .select('*')
                .eq('package_type', '3day')
                .order('city_code');

            if (error) throw error;

            const combinations = {
                'hammamet-sousse': { name: 'Hammamet & Sousse', emoji: '🏖️🏛️', description: 'Beach & History Combo' },
                'hammamet-monastir': { name: 'Hammamet & Monastir', emoji: '🏖️🕌', description: 'Coastal Escape' },
                'sousse-monastir': { name: 'Sousse & Monastir', emoji: '🏛️🕌', description: 'Historic Journey' },
                'all-cities': { name: 'All Three Cities', emoji: '🌊🌟', description: 'Complete Experience' }
            };

            return `
                <div class="space-y-6">
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-green-800">3-Day Itineraries Management</h3>
                        <p class="text-green-600 text-sm">Edit multi-city combination itineraries</p>
                    </div>
                    ${Object.entries(combinations).map(([code, combo]) => {
                        const itinerary = itineraries?.find(i => i.city_code === code) || {};
                        const scheduleText = itinerary.schedule?.text || '';
                        const highlightsText = (itinerary.highlights || []).join('\n');
                        
                        return `
                            <div class="bg-white border border-gray-200 rounded-lg p-6">
                                <div class="flex items-center mb-4">
                                    <span class="text-2xl mr-3">${combo.emoji}</span>
                                    <h3 class="text-xl font-bold text-gray-800">${combo.name} - ${combo.description}</h3>
                                </div>
                                <div class="space-y-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Itinerary Title</label>
                                        <input type="text" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                               value="${itinerary.title || `3-Day ${combo.name} Adventure`}" 
                                               data-field="title" 
                                               data-city-code="${code}">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                                  data-field="description" 
                                                  data-city-code="${code}">${itinerary.description || `Experience the perfect combination of ${combo.name} in three days. Carefully crafted itinerary for the best experience.`}</textarea>
                                    </div>
                                    <div class="grid grid-cols-2 gap-4">
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">Highlights (one per line)</label>
                                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                                      data-field="highlights" 
                                                      data-city-code="${code}" 
                                                      placeholder="Beach relaxation
UNESCO heritage sites
Local cuisine experiences">${highlightsText}</textarea>
                                        </div>
                                        <div>
                                            <label class="block text-sm font-medium text-gray-700 mb-2">3-Day Schedule (plain text)</label>
                                            <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-green-500 focus:border-green-500" 
                                                      data-field="schedule" 
                                                      data-city-code="${code}" 
                                                      placeholder="Day 1: Arrival in first city
Day 2: Travel and exploration
Day 3: Final experiences and departure">${scheduleText}</textarea>
                                        </div>
                                    </div>
                                    <button class="save-itinerary-btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200" 
                                            data-package-type="3day" 
                                            data-city-code="${code}">
                                        💾 Save ${combo.name} Itinerary
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Error loading 3-day admin content:', error);
            return '<p class="text-red-500 p-4">Error loading 3-day itineraries. Please refresh and try again.</p>';
        }
    }

    async get7DayAdminContent() {
        try {
            const { data: itineraries, error } = await this.supabase
                .from('itineraries')
                .select('*')
                .eq('package_type', '7day')
                .single();

            if (error) throw error;

            const itinerary = itineraries || {};
            const scheduleText = itinerary.schedule?.text || '';
            const highlightsText = (itinerary.highlights || []).join('\n');

            return `
                <div class="space-y-6">
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <h3 class="text-lg font-bold text-purple-800">7-Day Ultimate Coastal Journey</h3>
                        <p class="text-purple-600 text-sm">Edit the complete 7-day coastal experience</p>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-lg p-6">
                        <div class="flex items-center mb-4">
                            <span class="text-2xl mr-3">🌍</span>
                            <h3 class="text-xl font-bold text-gray-800">7-Day Complete Coastal Experience</h3>
                        </div>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Itinerary Title</label>
                                <input type="text" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                       value="${itinerary.title || '7-Day Ultimate Tunisian Coastal Journey'}" 
                                       data-field="title" 
                                       data-city-code="complete">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                          data-field="description" 
                                          data-city-code="complete">${itinerary.description || 'The complete Tunisian coastal experience exploring every facet of Hammamet, Sousse, and Monastir. This comprehensive journey combines beach relaxation, historical exploration, and deep cultural immersion for the perfect Tunisian adventure.'}</textarea>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Highlights (one per line)</label>
                                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                              data-field="highlights" 
                                              data-city-code="complete" 
                                              placeholder="Complete city exploration
UNESCO World Heritage sites
Mediterranean beach experiences">${highlightsText}</textarea>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">7-Day Schedule (plain text)</label>
                                    <textarea class="w-full px-3 py-2 border border-gray-300 rounded-lg h-48 focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                                              data-field="schedule" 
                                              data-city-code="complete" 
                                              placeholder="Day 1: Arrival in Hammamet
Day 2: Hammamet exploration
Day 3: Travel to Sousse
Day 4: Sousse immersion
Day 5: Travel to Monastir
Day 6: Monastir discovery
Day 7: Return journey">${scheduleText}</textarea>
                                </div>
                            </div>
                            <button class="save-itinerary-btn bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200" 
                                    data-package-type="7day" 
                                    data-city-code="complete">
                                💾 Save 7-Day Itinerary
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading 7-day admin content:', error);
            return '<p class="text-red-500 p-4">Error loading 7-day itinerary. Please refresh and try again.</p>';
        }
    }

    async handleSaveItinerary(packageType, cityCode) {
        if (!this.isAdmin) {
            this.showErrorMessage('Admin access required to save itineraries.');
            return;
        }

        this.showLoadingState();

        try {
            const title = document.querySelector(`input[data-field="title"][data-city-code="${cityCode}"]`)?.value;
            const description = document.querySelector(`textarea[data-field="description"][data-city-code="${cityCode}"]`)?.value;
            const highlights = document.querySelector(`textarea[data-field="highlights"][data-city-code="${cityCode}"]`)?.value.split('\n').filter(h => h.trim());
            
            // Get schedule as plain text
            const scheduleText = document.querySelector(`textarea[data-field="schedule"][data-city-code="${cityCode}"]`)?.value;
            const schedule = { text: scheduleText };

            const itineraryData = {
                package_type: packageType,
                city_code: cityCode,
                title: title,
                description: description,
                highlights: highlights,
                schedule: schedule,
                is_active: true,
                updated_at: new Date().toISOString()
            };

            console.log('💾 Saving itinerary:', itineraryData);

            // Check if itinerary exists
            const { data: existing, error: checkError } = await this.supabase
                .from('itineraries')
                .select('id')
                .eq('package_type', packageType)
                .eq('city_code', cityCode)
                .single();

            let result;
            if (existing && !checkError) {
                // Update existing
                result = await this.supabase
                    .from('itineraries')
                    .update(itineraryData)
                    .eq('id', existing.id);
            } else {
                // Create new
                result = await this.supabase
                    .from('itineraries')
                    .insert([itineraryData]);
            }

            if (result.error) {
                console.error('❌ Save error:', result.error);
                throw result.error;
            }

            this.showSuccessMessage(`✅ ${packageType} itinerary for ${cityCode} ${existing ? 'updated' : 'created'} successfully!`);
            
            // Reload the admin content to show updated data
            setTimeout(async () => {
                await this.loadAdminContent(packageType);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Error saving itinerary:', error);
            this.showErrorMessage('❌ Failed to save itinerary. Please try again.');
        } finally {
            this.hideLoadingState();
        }
    }

    // Utility Methods
    showLoadingState() {
        const buttons = document.querySelectorAll('button[type="submit"], .btn-primary, .save-itinerary-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
            const originalText = btn.innerHTML;
            btn.setAttribute('data-original-text', originalText);
            btn.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>';
        });
    }

    hideLoadingState() {
        const buttons = document.querySelectorAll('button[type="submit"], .btn-primary, .save-itinerary-btn');
        buttons.forEach(btn => {
            btn.disabled = false;
            const originalText = btn.getAttribute('data-original-text');
            if (originalText) {
                btn.innerHTML = originalText;
            }
        });
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.custom-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <span class="text-lg mr-2">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('translate-x-0', 'opacity-100');
        }, 10);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('translate-x-0', 'opacity-100');
            notification.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new TunisiaWithSammy();
});