// script.js

// ========== গ্লোবাল ভেরিয়েবল ==========
let currentPrayer = 'fajr';
let currentType = 'sunnat';
let isPlaying = false;
let currentStepIndex = 0;
let steps = [];
let totalRakats = 2;
let playInterval;
let audioEnabled = true;

// Three.js ভেরিয়েবল
let scene, camera, renderer, controls;
let character, leftArm, rightArm, leftLeg, rightLeg, head, torso;

// ========== নামাজের সম্পূর্ণ ডাটা ==========
const prayerData = {
    fajr: {
        name: 'ফজর',
        title: '🌅 ফজরের নামাজ',
        hasSunnat: true,
        hasFarz: true,
        sunnatName: '২ রাকাত সুন্নত',
        farzName: '২ রাকাত ফরজ',
        sunnat: {
            totalRakats: 2,
            steps: [
                { rakat: 1, action: 'নিয়ত', arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ سُنَّةَ الْفَجْرِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى', pronunciation: 'নাওয়াইতু আন উসাল্লিয়া সুন্নাতাল ফাজরি রাকআতাইনি লিল্লাহি তায়ালা', meaning: 'আমি দুই রাকাত ফজরের সুন্নত নামাজ পড়ার নিয়ত করছি', position: 'standing' },
                { rakat: 1, action: 'তাকবিরে তাহরিমা', arabic: 'اللَّهُ أَكْبَرُ', pronunciation: 'আল্লাহু আকবার', meaning: 'আল্লাহ মহান', position: 'standing' },
                { rakat: 1, action: 'সানা', arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَى جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ', pronunciation: 'সুবহানাকা আল্লাহুম্মা ওয়া বিহামদিকা ওয়া তাবারাকাসমুকা ওয়া তায়ালা জাদ্দুকা ওয়া লা ইলাহা গাইরুক', meaning: 'হে আল্লাহ! আপনি পবিত্র, আপনার প্রশংসা সহ', position: 'standing' },
                { rakat: 1, action: 'সূরা ফাতিহা', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', pronunciation: 'আলহামদু লিল্লাহি রাব্বিল আলামিন', meaning: 'সমস্ত প্রশংসা আল্লাহর যিনি বিশ্বজগতের প্রতিপালক', position: 'standing' },
                { rakat: 1, action: 'সূরা ইখলাস', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', pronunciation: 'কুল হুয়াল্লাহু আহাদ', meaning: 'বলুন, তিনি আল্লাহ এক', position: 'standing' },
                { rakat: 1, action: 'রুকু', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', pronunciation: 'সুবহানা রাব্বিয়াল আজিম', meaning: 'পবিত্র আমার মহান প্রতিপালক', position: 'bowing' },
                { rakat: 1, action: 'সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', meaning: 'পবিত্র আমার সর্বোচ্চ প্রতিপালক', position: 'prostrating' },
                { rakat: 1, action: 'দ্বিতীয় সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', meaning: 'পবিত্র আমার সর্বোচ্চ প্রতিপালক', position: 'prostrating' },
                { rakat: 2, action: 'সূরা ফাতিহা', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', pronunciation: 'আলহামদু লিল্লাহি', position: 'standing' },
                { rakat: 2, action: 'সূরা ফালাক', arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', pronunciation: 'কুল আউজু বিরাব্বিল ফালাক', meaning: 'বলুন, আমি আশ্রয় চাই প্রভাতের প্রতিপালকের কাছে', position: 'standing' },
                { rakat: 2, action: 'রুকু', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', pronunciation: 'সুবহানা রাব্বিয়াল আজিম', position: 'bowing' },
                { rakat: 2, action: 'সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' },
                { rakat: 2, action: 'দ্বিতীয় সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' },
                { rakat: 2, action: 'তাশাহহুদ', arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ', pronunciation: 'আত্তাহিয়্যাতু লিল্লাহি ওয়াস সালাওয়াতু ওয়াত তায়্যিবাত', meaning: 'সমস্ত মৌখিক, শারীরিক ও আর্থিক ইবাদত আল্লাহর জন্য', position: 'sitting' },
                { rakat: 2, action: 'সালাম', arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', pronunciation: 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ', meaning: 'আপনাদের উপর শান্তি ও আল্লাহর রহমত বর্ষিত হোক', position: 'sitting' }
            ]
        },
        farz: {
            totalRakats: 2,
            steps: [
                { rakat: 1, action: 'নিয়ত', arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ فَرْضَ الْفَجْرِ رَكْعَتَيْنِ لِلَّهِ تَعَالَى', pronunciation: 'নাওয়াইতু আন উসাল্লিয়া ফারজাল ফাজরি রাকআতাইনি লিল্লাহি তায়ালা', meaning: 'আমি দুই রাকাত ফজরের ফরজ নামাজ পড়ার নিয়ত করছি', position: 'standing' },
                { rakat: 1, action: 'তাকবিরে তাহরিমা', arabic: 'اللَّهُ أَكْبَرُ', pronunciation: 'আল্লাহু আকবার', position: 'standing' },
                { rakat: 1, action: 'সানা', arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ', pronunciation: 'সুবহানাকা আল্লাহুম্মা ওয়া বিহামদিকা', position: 'standing' },
                { rakat: 1, action: 'সূরা ফাতিহা', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', pronunciation: 'আলহামদু লিল্লাহি রাব্বিল আলামিন', position: 'standing' },
                { rakat: 1, action: 'সূরা', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', pronunciation: 'কুল হুয়াল্লাহু আহাদ', position: 'standing' },
                { rakat: 1, action: 'রুকু', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', pronunciation: 'সুবহানা রাব্বিয়াল আজিম', position: 'bowing' },
                { rakat: 1, action: 'সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' },
                { rakat: 1, action: 'দ্বিতীয় সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' },
                { rakat: 2, action: 'সূরা ফাতিহা', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', pronunciation: 'আলহামদু লিল্লাহি', position: 'standing' },
                { rakat: 2, action: 'সূরা', arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', pronunciation: 'কুল আউজু বিরাব্বিল ফালাক', position: 'standing' },
                { rakat: 2, action: 'রুকু', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', pronunciation: 'সুবহানা রাব্বিয়াল আজিম', position: 'bowing' },
                { rakat: 2, action: 'সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' },
                { rakat: 2, action: 'দ্বিতীয় সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' },
                { rakat: 2, action: 'তাশাহহুদ', arabic: 'التَّحِيَّاتُ لِلَّهِ', pronunciation: 'আত্তাহিয়্যাতু লিল্লাহি', position: 'sitting' },
                { rakat: 2, action: 'দরুদ', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', pronunciation: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ', position: 'sitting' },
                { rakat: 2, action: 'দোয়া', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', pronunciation: 'রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাহ', position: 'sitting' },
                { rakat: 2, action: 'সালাম', arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', pronunciation: 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ', position: 'sitting' }
            ]
        }
    },
    dhuhr: {
        name: 'যোহর',
        title: '☀️ যোহরের নামাজ',
        hasSunnat: true,
        hasFarz: true,
        sunnatName: '৪ রাকাত সুন্নত',
        farzName: '৪ রাকাত ফরজ',
        sunnat: generatePrayerSteps('dhuhr', 'sunnat', 4),
        farz: generatePrayerSteps('dhuhr', 'farz', 4)
    },
    asr: {
        name: 'আসর',
        title: '🌆 আসরের নামাজ',
        hasSunnat: true,
        hasFarz: true,
        sunnatName: '৪ রাকাত সুন্নত',
        farzName: '৪ রাকাত ফরজ',
        sunnat: generatePrayerSteps('asr', 'sunnat', 4),
        farz: generatePrayerSteps('asr', 'farz', 4)
    },
    maghrib: {
        name: 'মাগরিব',
        title: '🌇 মাগরিবের নামাজ',
        hasSunnat: true,
        hasFarz: true,
        sunnatName: '২ রাকাত সুন্নত',
        farzName: '৩ রাকাত ফরজ',
        sunnat: generatePrayerSteps('maghrib', 'sunnat', 2),
        farz: generatePrayerSteps('maghrib', 'farz', 3)
    },
    isha: {
        name: 'এশা',
        title: '🌙 এশার নামাজ',
        hasSunnat: true,
        hasFarz: true,
        sunnatName: '৪ রাকাত সুন্নত',
        farzName: '৪ রাকাত ফরজ',
        sunnat: generatePrayerSteps('isha', 'sunnat', 4),
        farz: generatePrayerSteps('isha', 'farz', 4)
    }
};

// নামাজের স্টেপ জেনারেটর ফাংশন
function generatePrayerSteps(prayer, type, totalRakats) {
    let steps = [];
    for (let rakat = 1; rakat <= totalRakats; rakat++) {
        steps.push({ rakat, action: 'নিয়ত', arabic: 'نَوَيْتُ أَنْ أُصَلِّيَ', pronunciation: 'নাওয়াইতু আন উসাল্লিয়া', meaning: 'নিয়ত করছি', position: 'standing' });
        steps.push({ rakat, action: 'তাকবির', arabic: 'اللَّهُ أَكْبَرُ', pronunciation: 'আল্লাহু আকবার', position: 'standing' });
        steps.push({ rakat, action: 'সানা', arabic: 'سُبْحَانَكَ اللَّهُمَّ', pronunciation: 'সুবহানাকা আল্লাহুম্মা', position: 'standing' });
        steps.push({ rakat, action: 'ফাতিহা', arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', pronunciation: 'আলহামদু লিল্লাহি', position: 'standing' });
        
        if (rakat <= 2 || type === 'sunnat') {
            steps.push({ rakat, action: 'সূরা', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', pronunciation: 'কুল হুয়াল্লাহু আহাদ', position: 'standing' });
        }
        
        steps.push({ rakat, action: 'রুকু', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', pronunciation: 'সুবহানা রাব্বিয়াল আজিম', position: 'bowing' });
        steps.push({ rakat, action: 'সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' });
        steps.push({ rakat, action: '২য় সিজদা', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', pronunciation: 'সুবহানা রাব্বিয়াল আলা', position: 'prostrating' });
        
        if (rakat % 2 === 0 || rakat === totalRakats) {
            steps.push({ rakat, action: 'তাশাহহুদ', arabic: 'التَّحِيَّاتُ لِلَّهِ', pronunciation: 'আত্তাহিয়্যাতু লিল্লাহি', position: 'sitting' });
        }
        
        if (rakat === totalRakats) {
            if (type === 'farz') {
                steps.push({ rakat, action: 'দরুদ', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', pronunciation: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদ', position: 'sitting' });
                steps.push({ rakat, action: 'দোয়া', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', pronunciation: 'রাব্বানা আতিনা ফিদ্দুনিয়া হাসানাহ', position: 'sitting' });
            }
            steps.push({ rakat, action: 'সালাম', arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', pronunciation: 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ', position: 'sitting' });
        }
    }
    return steps;
}

// ========== থ্রিডি সিন তৈরি ==========
function initThreeJS() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x154147);
    
    // ক্যামেরা
    camera = new THREE.PerspectiveCamera(45, document.getElementById('characterContainer').clientWidth / document.getElementById('characterContainer').clientHeight, 0.1, 1000);
    camera.position.set(3, 2, 5);
    camera.lookAt(0, 1.5, 0);
    
    // রেন্ডারার
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('characterCanvas'), antialias: true });
    renderer.setSize(document.getElementById('characterContainer').clientWidth, document.getElementById('characterContainer').clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // কন্ট্রোলস
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = true;
    controls.target.set(0, 1.5, 0);
    
    // লাইটিং
    setupLights();
    
    // এনভায়রনমেন্ট
    createEnvironment();
    
    // ক্যারেক্টার
    createCharacter();
    
    animate();
}

// লাইটিং সেটআপ
function setupLights() {
    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xfff5e6, 1.2);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    mainLight.receiveShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    const d = 10;
    mainLight.shadow.camera.left = -d;
    mainLight.shadow.camera.right = d;
    mainLight.shadow.camera.top = d;
    mainLight.shadow.camera.bottom = -d;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 15;
    scene.add(mainLight);
    
    const fillLight = new THREE.PointLight(0x446688, 0.5);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);
}

// এনভায়রনমেন্ট তৈরি
function createEnvironment() {
    const floorGeometry = new THREE.CircleGeometry(5, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a5f5a, roughness: 0.7, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    const carpetDesign = new THREE.Group();
    const ringGeometry = new THREE.TorusGeometry(1.2, 0.03, 16, 50);
    const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xf5c542, emissive: new THREE.Color(0x221100) });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.01;
    carpetDesign.add(ring);
    
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.sin(angle) * 1.8;
        const z = Math.cos(angle) * 1.8;
        const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 8),
            new THREE.MeshStandardMaterial({ color: 0xf5c542, emissive: new THREE.Color(0x221100) })
        );
        dot.position.set(x, 0.02, z);
        carpetDesign.add(dot);
    }
    scene.add(carpetDesign);
}

// ক্যারেক্টার তৈরি
function createCharacter() {
    character = new THREE.Group();
    character.position.set(0, 0, 0);
    
    // পাঞ্জাবি (শরীর)
    const torsoGeo = new THREE.CylinderGeometry(0.5, 0.6, 1.6, 8);
    const torsoMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 0.8;
    torso.castShadow = true;
    torso.receiveShadow = true;
    character.add(torso);
    
    // পায়জামা (পা)
    const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.9, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    leftLeg = new THREE.Mesh(legGeo, legMat);
    leftLeg.position.set(-0.2, 0.4, 0);
    leftLeg.castShadow = true;
    leftLeg.receiveShadow = true;
    character.add(leftLeg);
    
    rightLeg = new THREE.Mesh(legGeo, legMat);
    rightLeg.position.set(0.2, 0.4, 0);
    rightLeg.castShadow = true;
    rightLeg.receiveShadow = true;
    character.add(rightLeg);
    
    // মাথা
    const headGeo = new THREE.SphereGeometry(0.3, 32);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xf5d0a9 });
    head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.65;
    head.castShadow = true;
    head.receiveShadow = true;
    character.add(head);
    
    // টুপি
    const hatGeo = new THREE.ConeGeometry(0.25, 0.15, 8);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x228822 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 1.85;
    hat.castShadow = true;
    character.add(hat);
    
    // দাড়ি
    const beardGeo = new THREE.CylinderGeometry(0.18, 0.2, 0.12, 6);
    const beardMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const beard = new THREE.Mesh(beardGeo, beardMat);
    beard.position.set(0, 1.5, 0.25);
    beard.rotation.x = 0.2;
    beard.castShadow = true;
    character.add(beard);
    
    // চোখ
    const eyeGeo = new THREE.SphereGeometry(0.04, 6);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 1.72, 0.25);
    character.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 1.72, 0.25);
    character.add(rightEye);
    
    // হাত
    const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.0, 6);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.6, 1.2, 0);
    leftArm.rotation.z = 0.1;
    leftArm.castShadow = true;
    leftArm.receiveShadow = true;
    character.add(leftArm);
    
    rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.6, 1.2, 0);
    rightArm.rotation.z = -0.1;
    rightArm.castShadow = true;
    rightArm.receiveShadow = true;
    character.add(rightArm);
    
    // হাতের পাতা
    const handGeo = new THREE.SphereGeometry(0.1, 5);
    const handMat = new THREE.MeshStandardMaterial({ color: 0xf5d0a9 });
    
    const leftHand = new THREE.Mesh(handGeo, handMat);
    leftHand.position.set(-0.7, 0.7, 0);
    leftHand.castShadow = true;
    character.add(leftHand);
    
    const rightHand = new THREE.Mesh(handGeo, handMat);
    rightHand.position.set(0.7, 0.7, 0);
    rightHand.castShadow = true;
    character.add(rightHand);
    
    scene.add(character);
}

// ক্যারেক্টার পজিশন আপডেট
function updateCharacterPosition(position) {
    if (!character) return;
    
    character.rotation.x = 0;
    character.rotation.z = 0;
    leftArm.rotation.x = 0;
    rightArm.rotation.x = 0;
    leftLeg.rotation.x = 0;
    rightLeg.rotation.x = 0;
    head.rotation.x = 0;
    
    switch(position) {
        case 'standing':
            character.position.y = 0;
            leftArm.rotation.z = 0.1;
            rightArm.rotation.z = -0.1;
            break;
            
        case 'bowing':
            character.rotation.x = 0.5;
            character.position.y = -0.2;
            leftArm.rotation.x = -0.5;
            rightArm.rotation.x = -0.5;
            head.rotation.x = 0.2;
            break;
            
        case 'prostrating':
            character.position.y = -0.7;
            character.rotation.x = 0.9;
            leftArm.rotation.x = -0.8;
            rightArm.rotation.x = -0.8;
            leftLeg.rotation.x = 0.4;
            rightLeg.rotation.x = 0.4;
            head.rotation.x = 0.5;
            break;
            
        case 'sitting':
            character.position.y = -0.3;
            character.rotation.x = 0.2;
            leftLeg.rotation.x = 0.8;
            rightLeg.rotation.x = -0.8;
            break;
    }
}

// অ্যানিমেশন লুপ
function animate() {
    requestAnimationFrame(animate);
    
    controls.update();
    renderer.render(scene, camera);
}

// ========== ইউজার ইন্টারফেস ফাংশন ==========

// টাইপ সিলেক্টর আপডেট
function updateTypeSelector() {
    const selector = document.getElementById('typeSelector');
    if (!selector) return;
    
    let html = '';
    if (prayerData[currentPrayer].hasSunnat) {
        html += `<button class="type-btn ${currentType === 'sunnat' ? 'active' : ''}" onclick="selectType('sunnat')">${prayerData[currentPrayer].sunnatName}</button>`;
    }
    if (prayerData[currentPrayer].hasFarz) {
        html += `<button class="type-btn ${currentType === 'farz' ? 'active' : ''}" onclick="selectType('farz')">${prayerData[currentPrayer].farzName}</button>`;
    }
    selector.innerHTML = html;
}

// টাইপ সিলেক্ট
function selectType(type) {
    currentType = type;
    currentStepIndex = 0;
    updateTypeSelector();
    updateSteps();
    updateDetailsSection();
    updateDisplay();
    updateCharacterPosition('standing');
    
    if (isPlaying) {
        stopPrayer();
        startPrayer();
    }
}

// ওয়াক্ত সিলেক্ট
function selectPrayer(prayer) {
    currentPrayer = prayer;
    
    // ডিফল্ট টাইপ সেট
    if (prayerData[prayer].hasSunnat) {
        currentType = 'sunnat';
    } else {
        currentType = 'farz';
    }
    
    currentStepIndex = 0;
    
    // অ্যাক্টিভ ক্লাস আপডেট
    document.querySelectorAll('.prayer-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-prayer="${prayer}"]`).classList.add('active');
    
    updateTypeSelector();
    updateSteps();
    updateDetailsSection();
    updateDisplay();
    updateCharacterPosition('standing');
    
    if (isPlaying) {
        stopPrayer();
    }
}

// স্টেপ আপডেট
function updateSteps() {
    steps = prayerData[currentPrayer][currentType].steps;
    totalRakats = prayerData[currentPrayer][currentType].totalRakats;
}

// ডিটেইলস সেকশন আপডেট
function updateDetailsSection() {
    const section = document.getElementById('detailsSection');
    const data = prayerData[currentPrayer];
    const typeData = data[currentType];
    
    let stepsHtml = '';
    typeData.steps.forEach((step, index) => {
        stepsHtml += `
            <div class="namaz-step ${index === currentStepIndex ? 'active' : ''}" onclick="jumpToStep(${index})">
                <div class="step-rakat">রাকাত ${step.rakat}/${typeData.totalRakats}</div>
                <div class="step-title">${step.action}</div>
                <div class="step-arabic">${step.arabic}</div>
                <div>${step.pronunciation}</div>
            </div>
        `;
    });
    
    let rakatBadges = '';
    if (currentPrayer === 'fajr') {
        rakatBadges = '<span class="rakat-badge-detail">২ রাকাত সুন্নত</span><span class="rakat-badge-detail">২ রাকাত ফরজ</span>';
    } else if (currentPrayer === 'dhuhr') {
        rakatBadges = '<span class="rakat-badge-detail">৪ রাকাত সুন্নত</span><span class="rakat-badge-detail">৪ রাকাত ফরজ</span><span class="rakat-badge-detail">২ রাকাত সুন্নত</span><span class="rakat-badge-detail">২ রাকাত নফল</span>';
    } else if (currentPrayer === 'asr') {
        rakatBadges = '<span class="rakat-badge-detail">৪ রাকাত সুন্নত</span><span class="rakat-badge-detail">৪ রাকাত ফরজ</span>';
    } else if (currentPrayer === 'maghrib') {
        rakatBadges = '<span class="rakat-badge-detail">৩ রাকাত ফরজ</span><span class="rakat-badge-detail">২ রাকাত সুন্নত</span><span class="rakat-badge-detail">২ রাকাত নফল</span>';
    } else if (currentPrayer === 'isha') {
        rakatBadges = '<span class="rakat-badge-detail">৪ রাকাত সুন্নত</span><span class="rakat-badge-detail">৪ রাকাত ফরজ</span><span class="rakat-badge-detail">২ রাকাত সুন্নত</span><span class="rakat-badge-detail">৩ রাকাত বিতর</span>';
    }
    
    section.innerHTML = `
        <h2 class="prayer-title">${data.title} - ${typeData.name}</h2>
        <div class="rakat-summary">
            ${rakatBadges}
        </div>
        <div class="step-list">
            ${stepsHtml}
        </div>
        <div class="dua-section">
            <div class="dua-title">🤲 নামাজ শেষে আমল</div>
            <div class="tasbih-counter">
                <div class="counter-item">
                    <div class="counter-number">৩৩</div>
                    <div>সুবহানাল্লাহ</div>
                </div>
                <div class="counter-item">
                    <div class="counter-number">৩৩</div>
                    <div>আলহামদুলিল্লাহ</div>
                </div>
                <div class="counter-item">
                    <div class="counter-number">৩৪</div>
                    <div>আল্লাহু আকবার</div>
                </div>
            </div>
            <p>• ৩ বার আস্তাগফিরুল্লাহ</p>
            <p>• আয়াতুল কুরসি</p>
            <p>• নিজের মতো করে দোয়া</p>
        </div>
    `;
}

// নির্দিষ্ট স্টেপে যাওয়া
function jumpToStep(index) {
    if (isPlaying) {
        stopPrayer();
    }
    currentStepIndex = index;
    updateDetailsSection();
    updateDisplay();
}

// ডিসপ্লে আপডেট
function updateDisplay() {
    if (steps.length > 0 && currentStepIndex < steps.length) {
        const step = steps[currentStepIndex];
        
        document.getElementById('arabicDisplay').textContent = step.arabic;
        document.getElementById('pronunciationDisplay').textContent = step.pronunciation;
        document.getElementById('meaningDisplay').textContent = step.meaning || step.action;
        document.getElementById('rakatDisplay').textContent = `রাকাত ${step.rakat}/${totalRakats}`;
        document.getElementById('stepDisplay').textContent = `ধাপ ${currentStepIndex + 1}/${steps.length}`;
        document.getElementById('characterName').textContent = `${prayerData[currentPrayer].name}ের ${currentType === 'sunnat' ? 'সুন্নত' : 'ফরজ'} নামাজ`;
        
        updateCharacterPosition(step.position);
        
        // অডিও প্লে
        playAudio(step.arabic);
    }
}

// অডিও প্লে
function playAudio(text) {
    if (!audioEnabled) return;
    
    try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    } catch (e) {
        console.log('Audio playback failed:', e);
    }
}

// প্লে/পজ টগল
function togglePlay() {
    const btn = document.getElementById('playButton');
    const icon = document.getElementById('playIcon');
    const text = document.getElementById('playText');
    
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        btn.classList.add('playing');
        icon.className = 'fas fa-pause';
        text.textContent = 'থামান';
        startPrayer();
    } else {
        btn.classList.remove('playing');
        icon.className = 'fas fa-play';
        text.textContent = 'শুরু করুন';
        stopPrayer();
    }
}

// নামাজ শুরু
function startPrayer() {
    if (playInterval) clearInterval(playInterval);
    
    playInterval = setInterval(() => {
        currentStepIndex++;
        
        if (currentStepIndex >= steps.length) {
            // নামাজ শেষ
            stopPrayer();
            showCompletionMessage();
            return;
        }
        
        updateDisplay();
        updateDetailsSection();
    }, 4000);
}

// নামাজ বন্ধ
function stopPrayer() {
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    isPlaying = false;
    
    const btn = document.getElementById('playButton');
    const icon = document.getElementById('playIcon');
    const text = document.getElementById('playText');
    
    btn.classList.remove('playing');
    icon.className = 'fas fa-play';
    text.textContent = 'শুরু করুন';
    
    window.speechSynthesis.cancel();
}

// নামাজ রিসেট
function resetPrayer() {
    stopPrayer();
    currentStepIndex = 0;
    updateDisplay();
    updateDetailsSection();
    updateCharacterPosition('standing');
}

// সমাপ্তি বার্তা
function showCompletionMessage() {
    const infoPanel = document.getElementById('infoPanel');
    const originalContent = infoPanel.innerHTML;
    
    infoPanel.innerHTML = `
        <div class="surah-info">
            <div class="arabic-text" style="color: #4CAF50;">✨ নামাজ সম্পন্ন হয়েছে ✨</div>
            <div class="pronunciation-text">আলহামদুলিল্লাহ</div>
            <div class="meaning-text">সমস্ত প্রশংসা আল্লাহর</div>
            <div class="progress-info">
                <span class="rakat-badge">রাকাত ${totalRakats}/${totalRakats}</span>
                <span class="step-badge">সম্পূর্ণ</span>
            </div>
        </div>
    `;
    
    setTimeout(() => {
        resetPrayer();
        infoPanel.innerHTML = originalContent;
    }, 3000);
}

// সময় আপডেট
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('bn-BD', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
    });
    document.getElementById('time').textContent = timeString;
}

// উইন্ডো রিসাইজ হ্যান্ডলার
window.addEventListener('resize', () => {
    if (camera && renderer) {
        const container = document.getElementById('characterContainer');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
});

// ========== ইনিশিয়ালাইজ ==========
window.onload = function() {
    initThreeJS();
    setInterval(updateTime, 1000);
    updateTime();
    updateTypeSelector();
    updateSteps();
    updateDetailsSection();
    updateDisplay();
    
    // গ্লোবাল ফাংশন
    window.selectPrayer = selectPrayer;
    window.selectType = selectType;
    window.togglePlay = togglePlay;
    window.resetPrayer = resetPrayer;
    window.jumpToStep = jumpToStep;
};