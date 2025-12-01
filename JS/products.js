document.addEventListener("DOMContentLoaded", function () {
  // Hamburger menu functionality
  let hamburger = document.getElementById("hamburger");
  let navDesc = document.getElementById('navLinks');
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      navDesc.classList.toggle('open');
    });
  }

  // Filter toggle functionality - FIXED
  const filterToggle = document.querySelector('.filter-toggle');
  const filters = document.querySelector('.filters');
  
  console.log('Filter toggle element:', filterToggle); // Debug log
  console.log('Filters element:', filters); // Debug log
  
  if (filterToggle && filters) {
    filterToggle.addEventListener('click', function() {
      console.log('Filter toggle clicked'); // Debug log
      filters.classList.toggle('active');
      
      // Change button text based on state
      if (filters.classList.contains('active')) {
        filterToggle.textContent = 'Hide Filters';
      } else {
        filterToggle.textContent = 'Show Filters';
      }
    });
  } else {
    console.error('Filter toggle or filters element not found');
  }

  // Initialize page
  displayItems(PCParts);
  updateCartCount();

  // Add event listeners for filters
  document.querySelectorAll('input[name="brand"], input[name="category"]').forEach(input => {
    input.addEventListener("change", applyFilters);
  });

  // Search functionality
  const searchBarInput = document.getElementById("search-bar");
  if (searchBarInput) {
    searchBarInput.addEventListener("input", () => {
      let searchedItems = PCParts.filter((part) => {
        if (searchBarInput.value == "") return true;
        if (part.name.toUpperCase().includes(searchBarInput.value.toUpperCase()))
          return true;
        else return false;
      });
      displayItems(searchedItems);
    });
  }
});



let PCParts = [
  {
    name: "Intel Core i5-12600K",
    category: "CPU",
    brand: "Intel",
    price: 260,
    quantity: 10,
    desc: "12th Gen Alder Lake processor with 10 cores (6P+4E) and up to 4.9 GHz, offering excellent gaming and multitasking performance.",
    image: "img/Intel Core i5-12600K.png"
  },
  {
    name: "AMD Ryzen 7 5800X",
    category: "CPU",
    brand: "AMD",
    price: 320,
    quantity: 8,
    desc: "8-core, 16-thread processor with a base clock of 3.8 GHz and boost up to 4.7 GHz, ideal for high-performance gaming and content creation.",
    image: "img/AMD Ryzen 7 5800X.png"
  },
  {
    name: "NVIDIA GeForce RTX 3070 Ti",
    category: "GPU",
    brand: "NVIDIA",
    price: 600,
    quantity: 5,
    desc: "High-end graphics card with 8GB GDDR6X memory, delivering excellent 4K gaming performance and real-time ray tracing capabilities.",
    image: "img/RTX 3070 TI.png"

  },
  {
    name: "Corsair Vengeance LPX 16GB DDR4 3200MHz",
    category: "RAM",
    brand: "Corsair",
    price: 75,
    quantity: 20,
    desc: "High-performance DDR4 memory optimized for overclocking, ensuring reliable and fast performance for gaming and multitasking.",
    image: "img/Corsair Vengeance LPX 16GB DDR4 3200MHz.png"

  },
  {
    name: "ASUS ROG Strix B550-F Gaming",
    category: "Motherboard",
    brand: "ASUS",
    price: 180,
    quantity: 12,
    desc: "ATX motherboard with PCIe 4.0 support, robust power delivery, and comprehensive cooling, designed for AMD Ryzen processors.",
    image: "img/ASUS ROG Strix B550-F Gaming.png"
  },
  {
    name: "Samsung 970 EVO Plus 1TB NVMe SSD",
    category: "Storage",
    brand: "Samsung",
    price: 120,
    quantity: 15,
    desc: "High-speed NVMe SSD with up to 3,500 MB/s read speeds, offering fast boot times and quick data access for improved system responsiveness.",
    image: "img/Samsung 970 EVO Plus 1TB NVMe SSD.png"
  },
  {
    name: "Logitech G502 HERO",
    category: "Mouse",
    brand: "Logitech",
    price: 50,
    quantity: 25,
    desc: "Wired gaming mouse with HERO 25K sensor, customizable weights, and 11 programmable buttons for precision and control.",
    image: "img/Logitech G502 HERO.png"
  },
  {
    name: "Razer DeathAdder V2",
    category: "Mouse",
    brand: "Razer",
    price: 70,
    quantity: 18,
    desc: "Ergonomic wired gaming mouse with 20,000 DPI optical sensor and Razer Speedflex cable for smooth, accurate tracking.",
    image: "img/Razer DeathAdder V2.png"
  },
  {
    name: "Corsair K95 RGB Platinum",
    category: "Keyboard",
    brand: "Corsair",
    price: 200,
    quantity: 10,
    desc: "Mechanical gaming keyboard featuring Cherry MX switches, dynamic RGB lighting, and dedicated macro keys for enhanced gameplay.",
    image: "img/Corsair K95 RGB Platinum.png"
  },
  {
    name: "SteelSeries Apex Pro Gen 3",
    category: "Keyboard",
    brand: "SteelSeries",
    price: 199,
    quantity: 7,
    desc: "Advanced gaming keyboard with OmniPoint 3.0 adjustable switches, OLED smart display, and per-key RGB illumination for customization.",
    image: "img/SteelSeries Apex Pro Gen 3.jpg"

  },

  {
    name: "Intel Core i7-12700K",
    category: "CPU",
    brand: "Intel",
    price: 380,
    quantity: 12,
    desc: "12th Gen Alder Lake processor with 12 cores (8P+4E) and up to 5.0 GHz, offering exceptional performance for gaming and productivity.",
    image: "img/Intel Core i7-12700K.png"
  },
  {
    name: "AMD Ryzen 9 5900X",
    category: "CPU",
    brand: "AMD",
    price: 450,
    quantity: 10,
    desc: "12-core, 24-thread processor with a base clock of 3.7 GHz and boost up to 4.8 GHz, ideal for high-end gaming and content creation.",
    image: "img/AMD Ryzen 9 5900X.png"
  },

  {
    name: "NVIDIA GeForce RTX 3080 Ti",
    category: "GPU",
    brand: "NVIDIA",
    price: 1200,
    quantity: 4,
    desc: "High-performance graphics card with 12GB GDDR6X memory, delivering top-tier 4K gaming and ray tracing capabilities.",
    image: "img/NVIDIA GeForce RTX 3080 Ti.png"
  },
  {
    name: "AMD Radeon RX 6800 XT",
    category: "GPU",
    brand: "AMD",
    price: 650,
    quantity: 6,
    desc: "Powerful graphics card with 16GB GDDR6 memory, offering excellent performance for 4K gaming and DirectX 12 Ultimate support.",
    image: "img/AMD Radeon RX 6800 XT.png"
  },


  {
    name: "Corsair Vengeance RGB Pro 32GB DDR4 3600MHz",
    category: "RAM",
    brand: "Corsair",
    price: 180,
    quantity: 15,
    desc: "High-performance DDR4 memory with dynamic RGB lighting, optimized for overclocking and multitasking.",
    image: "img/Corsair Vengeance RGB Pro 32GB DDR4 3600MHz.png"
  },
  {
    name: "G.SKILL Trident Z Royal 16GB DDR4 3200MHz",
    category: "RAM",
    brand: "G.SKILL",
    price: 120,
    quantity: 10,
    desc: "Premium DDR4 memory with crystalline light bar and polished aluminum heatspreaders, delivering both performance and aesthetics.",
    image: "img/G.SKILL Trident Z Royal 16GB DDR4 3200MHz.png"
  },


  {
    name: "ASUS TUF Gaming X570-Plus",
    category: "Motherboard",
    brand: "ASUS",
    price: 200,
    quantity: 8,
    desc: "ATX motherboard with PCIe 4.0 support, military-grade components, and comprehensive cooling for AMD Ryzen processors.",
    image: "img/ASUS TUF Gaming X570-Plus.png"
  },
  {
    name: "MSI MPG Z690 Carbon WiFi",
    category: "Motherboard",
    brand: "MSI",
    price: 300,
    quantity: 5,
    desc: "High-end ATX motherboard with DDR5 support, Wi-Fi 6E, and robust power delivery for Intel 12th Gen processors.",
    image: "img/MSI MPG Z690 Carbon WiFi.png"
  },


  {
    name: "Samsung 980 PRO 2TB NVMe SSD",
    category: "Storage",
    brand: "Samsung",
    price: 250,
    quantity: 10,
    desc: "High-speed NVMe SSD with PCIe 4.0 interface, offering up to 7,000 MB/s read speeds for ultra-fast data access.",
    image: "img/Samsung 980 PRO 2TB NVMe SSD.png"
  },
  {
    name: "Western Digital Black SN850 1TB NVMe SSD",
    category: "Storage",
    brand: "Western Digital",
    price: 150,
    quantity: 12,
    desc: "Performance-focused NVMe SSD with PCIe 4.0 support, delivering read speeds up to 7,000 MB/s for gaming and content creation.",
    image: "img/Western Digital Black SN850 1TB NVMe SSD.png"
  },


  {
    name: "Logitech MX Master 3",
    category: "Mouse",
    brand: "Logitech",
    price: 100,
    quantity: 20,
    desc: "Ergonomic wireless mouse with advanced scrolling, customizable buttons, and cross-computer control for productivity.",
    image: "img/Logitech MX Master 3.png"
  },
  {
    name: "Razer Basilisk V3",
    category: "Mouse",
    brand: "Razer",
    price: 70,
    quantity: 15,
    desc: "Wired gaming mouse with 11 programmable buttons, customizable RGB lighting, and a 26,000 DPI optical sensor.",
    image: "img/Razer Basilisk V3.png"
  },


  {
    name: "Corsair K70 RGB MK.2",
    category: "Keyboard",
    brand: "Corsair",
    price: 160,
    quantity: 10,
    desc: "Mechanical gaming keyboard with Cherry MX switches, dynamic RGB lighting, and dedicated media controls.",
    image: "img/Corsair K70 RGB MK.2.png"
  },
  {
    name: "SteelSeries Apex 7",
    category: "Keyboard",
    brand: "SteelSeries",
    price: 150,
    quantity: 8,
    desc: "Mechanical gaming keyboard featuring an OLED smart display, per-key RGB illumination, and a premium magnetic wrist rest.",
    image: "img/SteelSeries Apex 7.png"
  },
  {
    name: "Intel Core i3-12100F",
    category: "CPU",
    brand: "Intel",
    price: 110,
    quantity: 20,
    desc: "Affordable quad-core CPU offering great performance for budget gaming builds.",
    image: "img/i3-12100F.png"
  },
  {
    name: "AMD Ryzen 5 5600",
    category: "CPU",
    brand: "AMD",
    price: 160,
    quantity: 15,
    desc: "6-core, 12-thread processor delivering excellent value for mid-range gaming PCs.",
    image: "img/AMD Ryzen 5 5600.png"
  },
  {
    name: "AMD Ryzen 9 7950X",
    category: "CPU",
    brand: "AMD",
    price: 650,
    quantity: 6,
    desc: "16-core, 32-thread Zen 4 processor with PCIe 5.0 and DDR5 support for enthusiasts.",
    image: "img/AMD Ryzen 9 7950X.png"
  },
  {
    name: "Intel Core i9-13900K",
    category: "CPU",
    brand: "Intel",
    price: 620,
    quantity: 8,
    desc: "13th Gen Raptor Lake CPU with 24 cores and blazing performance for creators and gamers.",
    image: "img/Intel Core i9-13900K.png"
  },
  {
    name: "AMD Ryzen 7 7800X3D",
    category: "CPU",
    brand: "AMD",
    price: 450,
    quantity: 10,
    desc: "8-core gaming powerhouse with 3D V-Cache for incredible frame rates.",
    image: "img/AMD Ryzen 7 7800X3D.png"
  },

  {
    name: "NVIDIA GeForce RTX 4060 Ti",
    category: "GPU",
    brand: "NVIDIA",
    price: 400,
    quantity: 10,
    desc: "Efficient 1080p and 1440p gaming GPU with DLSS 3 and ray tracing support.",
    image: "img/NVIDIA GeForce RTX 4060 Ti.png"
  },
  {
    name: "NVIDIA GeForce RTX 4090",
    category: "GPU",
    brand: "NVIDIA",
    price: 1799,
    quantity: 3,
    desc: "Ultimate gaming GPU with 24GB GDDR6X memory, delivering unmatched 4K performance.",
    image: "img/NVIDIA GeForce RTX 4090.png"
  },
  {
    name: "AMD Radeon RX 7900 XT",
    category: "GPU",
    brand: "AMD",
    price: 850,
    quantity: 5,
    desc: "High-end GPU with 20GB GDDR6 memory and RDNA 3 architecture for next-gen gaming.",
    image: "img/AMD Radeon RX 7900 XT.png"
  },
  {
    name: "AMD Radeon RX 6600",
    category: "GPU",
    brand: "AMD",
    price: 230,
    quantity: 12,
    desc: "Budget-friendly GPU for 1080p gaming with excellent efficiency.",
    image: "img/AMD Radeon RX 6600.png"
  },
  {
    name: "Intel Arc A770",
    category: "GPU",
    brand: "Intel",
    price: 320,
    quantity: 10,
    desc: "Intel's discrete GPU offering solid 1440p performance and ray tracing support.",
    image: "img/Intel Arc A770.png"
  },

  {
    name: "Kingston Fury Beast 16GB DDR4 3600MHz",
    category: "RAM",
    brand: "Kingston",
    price: 65,
    quantity: 25,
    desc: "Reliable DDR4 RAM with sleek heat spreader and plug-and-play performance.",
    image: "img/Kingston Fury Beast 16GB DDR4 3600MHz.png"
  },
  {
    name: "Corsair Dominator Platinum RGB 32GB DDR5 5600MHz",
    category: "RAM",
    brand: "Corsair",
    price: 260,
    quantity: 10,
    desc: "Premium DDR5 memory with advanced RGB lighting and ultra-fast performance.",
    image: "img/Corsair Dominator Platinum RGB 32GB DDR5 5600MHz.png"
  },
  {
    name: "Team T-Force Delta RGB 16GB DDR4 3200MHz",
    category: "RAM",
    brand: "TeamGroup",
    price: 70,
    quantity: 15,
    desc: "Stylish RGB DDR4 memory delivering reliable gaming performance.",
    image: "img/Team T-Force Delta RGB 16GB DDR4 3200MHz.png"
  },
  {
    name: "G.SKILL Ripjaws V 32GB DDR4 3600MHz",
    category: "RAM",
    brand: "G.SKILL",
    price: 150,
    quantity: 12,
    desc: "High-speed DDR4 kit designed for gamers and content creators.",
    image: "img/G.SKILL Ripjaws V 32GB DDR4 3600MHz.png"
  },
  {
    name: "Crucial Pro 32GB DDR5 5600MHz",
    category: "RAM",
    brand: "Crucial",
    price: 190,
    quantity: 10,
    desc: "DDR5 memory optimized for next-gen platforms, ensuring fast multitasking.",
    image: "img/Crucial Pro 32GB DDR5 5600MHz.png"
  },


  {
    name: "Gigabyte B550 AORUS Elite V2",
    category: "Motherboard",
    brand: "Gigabyte",
    price: 160,
    quantity: 10,
    desc: "Solid AM4 motherboard with PCIe 4.0 support and durable build quality.",
    image: "img/Gigabyte B550 AORUS Elite V2.png"
  },
  {
    name: "ASRock X670E Taichi",
    category: "Motherboard",
    brand: "ASRock",
    price: 350,
    quantity: 6,
    desc: "High-end AM5 motherboard with DDR5 and PCIe 5.0 support.",
    image: "img/ASRock X670E Taichi.png"
  },
  {
    name: "MSI B760M Mortar WiFi",
    category: "Motherboard",
    brand: "MSI",
    price: 190,
    quantity: 8,
    desc: "Compact Intel 12th/13th Gen motherboard with Wi-Fi 6 and DDR5 support.",
    image: "img/MSI B760M Mortar WiFi.png"
  },
  {
    name: "Gigabyte Z790 AORUS Master",
    category: "Motherboard",
    brand: "Gigabyte",
    price: 480,
    quantity: 4,
    desc: "Top-tier Intel motherboard with exceptional cooling and power design.",
    image: "img/Gigabyte Z790 AORUS Master.png"
  },
  {
    name: "ASUS Prime B660M-A D4",
    category: "Motherboard",
    brand: "ASUS",
    price: 130,
    quantity: 14,
    desc: "Affordable LGA1700 motherboard for budget Intel builds.",
    image: "img/ASUS Prime B660M-A D4.png"
  },


  {
    name: "Crucial P3 Plus 1TB NVMe SSD",
    category: "Storage",
    brand: "Crucial",
    price: 85,
    quantity: 18,
    desc: "PCIe 4.0 SSD with up to 5000 MB/s read speeds for fast performance.",
    image: "img/Crucial P3 Plus 1TB NVMe SSD.png"
  },
  {
    name: "Seagate FireCuda 530 2TB NVMe SSD",
    category: "Storage",
    brand: "Seagate",
    price: 280,
    quantity: 6,
    desc: "Top-tier PCIe 4.0 SSD built for gamers and creators.",
    image: "img/Seagate FireCuda 530 2TB NVMe SSD.png"
  },
  {
    name: "WD Blue 2TB HDD",
    category: "Storage",
    brand: "Western Digital",
    price: 60,
    quantity: 20,
    desc: "Reliable 2TB HDD ideal for mass storage and backups.",
    image: "img/WD Blue 2TB HDD.png"
  },
  {
    name: "Seagate Barracuda 4TB HDD",
    category: "Storage",
    brand: "Seagate",
    price: 90,
    quantity: 10,
    desc: "High-capacity HDD with dependable performance for large storage needs.",
    image: "img/Seagate Barracuda 4TB HDD.png"
  },
  {
    name: "Samsung 990 PRO 1TB NVMe SSD",
    category: "Storage",
    brand: "Samsung",
    price: 180,
    quantity: 8,
    desc: "Ultra-fast PCIe 4.0 SSD for demanding workloads and gaming.",
    image: "img/Samsung 990 PRO 1TB NVMe SSD.png"
  },


  {
    name: "HyperX Pulsefire FPS Pro",
    category: "Mouse",
    brand: "HyperX",
    price: 45,
    quantity: 20,
    desc: "RGB gaming mouse with Pixart 3389 sensor and ergonomic shape.",
    image: "img/HyperX Pulsefire FPS Pro.png"
  },
  {
    name: "Glorious Model O Wireless",
    category: "Mouse",
    brand: "Glorious",
    price: 80,
    quantity: 10,
    desc: "Lightweight wireless mouse with honeycomb design and fast response.",
    image: "img/Glorious Model O Wireless.png"
  },
  {
    name: "Logitech G Pro X Superlight",
    category: "Mouse",
    brand: "Logitech",
    price: 140,
    quantity: 8,
    desc: "Ultra-light wireless mouse designed for esports performance.",
    image: "img/Logitech G Pro X Superlight.png"
  },
  {
    name: "Cooler Master MM711",
    category: "Mouse",
    brand: "Cooler Master",
    price: 40,
    quantity: 15,
    desc: "Honeycomb lightweight mouse for gamers seeking precision and comfort.",
    image: "img/Cooler Master MM711.png"
  },
  {
    name: "Razer Viper Ultimate",
    category: "Mouse",
    brand: "Razer",
    price: 120,
    quantity: 12,
    desc: "Wireless gaming mouse with Focus+ 20K sensor and low latency.",
    image: "img/Razer Viper Ultimate.png"
  },


  {
    name: "HyperX Alloy Origins",
    category: "Keyboard",
    brand: "HyperX",
    price: 110,
    quantity: 10,
    desc: "Compact mechanical keyboard with RGB lighting and durable switches.",
    image: "img/HyperX Alloy Origins.png"
  },
  {
    name: "Logitech G915 TKL",
    category: "Keyboard",
    brand: "Logitech",
    price: 230,
    quantity: 5,
    desc: "Wireless low-profile mechanical keyboard with LIGHTSPEED technology.",
    image: "img/Logitech G915 TKL.png"
  },
  {
    name: "Razer BlackWidow V4 Pro",
    category: "Keyboard",
    brand: "Razer",
    price: 250,
    quantity: 6,
    desc: "Feature-rich RGB keyboard with macro keys and premium design.",
    image: "img/Razer BlackWidow V4 Pro.png"
  },
  {
    name: "Keychron K6 Wireless",
    category: "Keyboard",
    brand: "Keychron",
    price: 100,
    quantity: 10,
    desc: "Compact 65% wireless keyboard suitable for gaming and typing.",
    image: "img/Keychron K6 Wireless.png"
  },
  {
    name: "Ducky One 3 Mini",
    category: "Keyboard",
    brand: "Ducky",
    price: 130,
    quantity: 8,
    desc: "Premium 60% keyboard with vibrant color themes and mechanical precision.",
    image: "img/Ducky One 3 Mini.png"
  },


  {
    name: "PlayStation 5",
    category: "Console",
    brand: "Sony",
    price: 500,
    quantity: 10,
    desc: "Next-gen console with lightning-fast SSD and stunning 4K gaming performance.",
    image: "img/PlayStation 5.png"
  },
  {
    name: "PlayStation 5 Digital Edition",
    category: "Console",
    brand: "Sony",
    price: 450,
    quantity: 8,
    desc: "Disc-free PS5 for fully digital gaming with same next-gen performance.",
    image: "img/PlayStation 5 Digital Edition.png"
  },
  {
    name: "PlayStation 4 Slim",
    category: "Console",
    brand: "Sony",
    price: 300,
    quantity: 10,
    desc: "Slim and efficient console perfect for casual gamers and multimedia use.",
    image: "img/PlayStation 4 Slim.png"
  },
  {
    name: "Xbox Series X",
    category: "Console",
    brand: "Microsoft",
    price: 500,
    quantity: 10,
    desc: "Powerful console with 12 teraflops of GPU performance for 4K gaming.",
    image: "img/Xbox Series X.png"
  },
  {
    name: "Xbox Series S",
    category: "Console",
    brand: "Microsoft",
    price: 300,
    quantity: 12,
    desc: "Compact and affordable console with smooth 1440p performance.",
    image: "img/Xbox Series S.png"
  },


  {
    name: "DualSense Wireless Controller",
    category: "Accessory",
    brand: "Sony",
    price: 70,
    quantity: 20,
    desc: "Next-gen PlayStation controller with adaptive triggers and haptic feedback.",
    image: "img/DualSense Wireless Controller.png"
  },
  {
    name: "DualSense Charging Station",
    category: "Accessory",
    brand: "Sony",
    price: 30,
    quantity: 15,
    desc: "Charging dock for two DualSense controllers simultaneously.",
    image: "img/DualSense Charging Station.png"
  },
  {
    name: "Pulse 3D Wireless Headset",
    category: "Accessory",
    brand: "Sony",
    price: 100,
    quantity: 10,
    desc: "Wireless headset for PS5 with 3D audio support and noise-canceling mic.",
    image: "img/Pulse 3D Wireless Headset.png"
  },
  {
    name: "Xbox Wireless Controller",
    category: "Accessory",
    brand: "Microsoft",
    price: 60,
    quantity: 20,
    desc: "Refined controller with hybrid D-pad, textured grips, and Bluetooth support.",
    image: "img/Xbox Wireless Controller.png"
  },
  {
    name: "Xbox Stereo Headset",
    category: "Accessory",
    brand: "Microsoft",
    price: 50,
    quantity: 15,
    desc: "Comfortable wired headset designed for Xbox gaming with rich audio.",
    image: "img/Xbox Stereo Headset.png"
  },
  {
    name: "Xbox Rechargeable Battery Kit",
    category: "Accessory",
    brand: "Microsoft",
    price: 25,
    quantity: 20,
    desc: "Rechargeable battery pack with USB-C cable for Xbox controllers.",
    image: "img/Xbox Rechargeable Battery Kit.png"

  },

  // ==================== Headsets / Gaming Headphones ====================
  {
    name: "HyperX Cloud II",
    category: "Accessory",
    brand: "HyperX",
    price: 80,
    quantity: 25,
    desc: "Wired over-ear gaming headset with 53mm drivers, virtual 7.1 surround sound and multi-platform compatibility (PC, PS5, Xbox, Switch).",
    image: "img/HyperX Cloud II.png"
  },
  {
    name: "HyperX Cloud II Wireless",
    category: "Accessory",
    brand: "HyperX",
    price: 120,
    quantity: 20,
    desc: "Wireless gaming headset (2.4GHz) from HyperX offering the same comfort as Cloud II with added freedom and long battery life.",
    image: "img/HyperX Cloud II Wireless.png"
  },
  {
    name: "SteelSeries Arctis Pro Wireless",
    category: "Accessory",
    brand: "SteelSeries",
    price: 349,
    quantity: 8,
    desc: "High-end hi-res capable wireless gaming headset with dual-wireless (2.4GHz + Bluetooth), swappable batteries and premium build.",
    image: "img/SteelSeries Arctis Pro Wireless.png"
  },
  {
    name: "Logitech G733 Lightspeed Wireless",
    category: "Accessory",
    brand: "Logitech",
    price: 150,
    quantity: 12,
    desc: "Lightweight wireless gaming headset with RGB lighting, Bluetooth + USB dongle and good battery life — cross-platform compatible.",
    image: "img/Logitech G733 Lightspeed Wireless.png"
  },
  {
    name: "Razer BlackShark V2 Pro",
    category: "Accessory",
    brand: "Razer",
    price: 200,
    quantity: 10,
    desc: "Premium wireless esports headset from Razer with high-quality mic, 50mm drivers and excellent comfort for long sessions.",
    image: "img/Razer BlackShark V2 Pro.png"
  },
  {
    name: "Corsair HS55 Stereo",
    category: "Accessory",
    brand: "Corsair",
    price: 90,
    quantity: 18,
    desc: "Budget friendly wired gaming headset offering solid audio and comfort, good value for casual console and PC gamers.",
    image: "img/Corsair HS55 Stereo.png"
  },
  {
    name: "JBL Quantum Over-Ear Headset",
    category: "Accessory",
    brand: "JBL",
    price: 130,
    quantity: 14,
    desc: "Gaming headset designed for immersive spatial audio with the JBL QuantumSURROUND and wide platform compatibility.",
    image: "img/JBL Quantum Over-Ear Headset.png"
  },
  {
    name: "Turtle Beach Stealth 600 Gen 3",
    category: "Accessory",
    brand: "Turtle Beach",
    price: 110,
    quantity: 16,
    desc: "Wireless headset tailored for consoles with good battery life, comfortable fit and strong game/chat mixing features.",
    image: "img/Turtle Beach Stealth 600 Gen 3.png"
  },
  {
    name: "Sony INZONE H7 Wireless Gaming Headset",
    category: "Accessory",
    brand: "Sony",
    price: 180,
    quantity: 9,
    desc: "Wireless headset from Sony’s INZONE line, optimized for PS5 + PC with long battery life and 360 spatial sound features.",
    image: "img/Sony INZONE H7 Wireless Gaming Headset.png"
  },
  {
    name: "Audeze Maxwell Wireless Headset",
    category: "Accessory",
    brand: "Audeze",
    price: 299,
    quantity: 7,
    desc: "Audiophile-level wireless gaming headset with planar magnetic drivers and premium materials — for gamers who want top audio fidelity.",
    image: "img/Audeze Maxwell Wireless Headset.png"
  }



];


localStorage.setItem("PCParts", JSON.stringify(PCParts));
const Products_grid = document.querySelector(".product-grid");


function displayItems(PCPartsArray) {
  const displayProducts = PCPartsArray.map(part => {
    return `
      <article class="product-card">
        <a href="product.html">
          <img src="${part.image}" alt="${part.name}" />
          <h3>${part.name}</h3>
        </a>
        <p class="price">$${part.price}</p>
        <button class="add-to-cart" onclick="addToCartByName('${part.name}')">Add to Cart</button>
      </article>
    `;
  }).join("");
  Products_grid.innerHTML = displayProducts;
}

function getSelectedFilters() {
  const selectedBrand = document.querySelector('input[name="brand"]:checked')?.value || "ALL";
  const selectedCategory = document.querySelector('input[name="category"]:checked')?.value || "ALL";
  return { brand: selectedBrand.toUpperCase(), category: selectedCategory.toUpperCase() };
}

function applyFilters() {
  const { brand, category } = getSelectedFilters();

  const filteredItems = PCParts.filter(part => {
    const brandMatch = (brand === "ALL") || (part.brand.toUpperCase() === brand);
    const categoryMatch = (category === "ALL") || (part.category.toUpperCase() === category);
    return brandMatch && categoryMatch;
  });

  displayItems(filteredItems);
}

function displayItems(PCPartsArray) {
  const displayProducts = PCPartsArray.map(part => {
    return `
      <article class="product-card">
        <a href="product.html?product=${encodeURIComponent(part.name)}" class="product-link">
          <img src="${part.image}" alt="${part.name}" />
          <h3>${part.name}</h3>
        </a>
        <p class="price">$${part.price}</p>
        <button class="add-to-cart" onclick="addToCartByName('${part.name}')">Add to Cart</button>
      </article>
    `;
  }).join("");
  Products_grid.innerHTML = displayProducts;
}

function updateCartCount() {
  let cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  
  let cart;

if (currentUser && currentUser.email) {
    cart = allCarts[currentUser.email] || [];
} else {
    cart = []; // guest user
}


  let totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCount.textContent = totalQty;
  cartCount.style.display = totalQty > 0 ? "inline-block" : "none";
}

let currentUser = JSON.parse(sessionStorage.getItem("currentUser"))


function addToCartByName(productName) {
  if (!currentUser) return alert("Please login!")
  const product = PCParts.find(p => p.name === productName);
  if (!product) return;

  let allCarts = JSON.parse(localStorage.getItem("allCarts")) || {};
  let cart = allCarts[currentUser.email] || []

  const existing = cart.find(item => item.name === product.name);

  const currentQtyInCart = existing ? existing.quantity : 0;

  if (currentQtyInCart + 1 > product.quantity) {
    alert(`Sorry, only ${product.quantity} units of "${product.name}" are available.`);
    return;
  }

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  allCarts[currentUser.email] = cart
  localStorage.setItem("allCarts", JSON.stringify(allCarts));

  updateCartCount();

  alert(`${product.name} added to cart`);
}



document.body.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const btn = e.target;
    btn.classList.add("clicked");
    setTimeout(() => {
      btn.classList.remove("clicked");
    }, 300);

    const card = btn.closest(".product-card");
    if (card) {
      card.classList.add("animate");
      setTimeout(() => {
        card.classList.remove("animate");
      }, 400);
    }
  }
});


document.addEventListener("DOMContentLoaded", () => {
  displayItems(PCParts);
  updateCartCount();

  document.querySelectorAll('input[name="brand"], input[name="category"]').forEach(input => {
    input.addEventListener("change", applyFilters);
  });
});

const searchBarInput = document.getElementById("search-bar")
searchBarInput.addEventListener("input", () => {
  let searchedItems = PCParts.filter((part => {
    if (searchBarInput.value == "") return true
    if (part.name.toUpperCase().includes(searchBarInput.value.toUpperCase()))
      return true
    else return false
  }))
  displayItems(searchedItems)
})
