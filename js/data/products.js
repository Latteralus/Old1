// /thepharmacy/js/data/products.js

const productsData = [
  {
      id: 'pd001',
      name: 'Acetaminophen Tablet',
      description: 'Pain relief and fever reduction.',
      inventory: 0,
      suggestedPrice: 5.99,
      price: 5.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing001', quantity: 100 }, // Acetaminophen Base
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing003', quantity: 10 },  // Magnesium Stearate
          { id: 'ing004', quantity: 5 }    // Talc Powder
      ],
      equipmentNeeded: ['eq001', 'eq002', 'eq003'], // Mortar and Pestle, Tablet Press, Powder Blender
      productionTime: 15, // Time in minutes
  },
  {
      id: 'pd002',
      name: 'Ibuprofen Capsule',
      description: 'Pain and inflammation relief.',
      inventory: 0,
      suggestedPrice: 7.99,
      price: 7.99,
      dosageForm: 'capsule',
      ingredients: [
          { id: 'ing005', quantity: 200 }, // Ibuprofen Powder
          { id: 'ing006', quantity: 50 },  // Gelatin Caps
          { id: 'ing007', quantity: 10 },  // Talc Powder
          { id: 'ing008', quantity: 5 }    // Magnesium Stearate
      ],
      equipmentNeeded: ['eq004', 'eq003', 'eq001'], // Capsule Filler, Powder Blender, Mortar and Pestle
      productionTime: 20,
  },
  {
      id: 'pd003',
      name: 'Amoxicillin Suspension',
      description: 'Antibiotic for bacterial infections.',
      inventory: 0,
      suggestedPrice: 10.99,
      price: 10.99,
      dosageForm: 'suspension',
      ingredients: [
          { id: 'ing009', quantity: 100 }, // Amoxicillin Trihydrate
          { id: 'ing010', quantity: 50 },  // Lactose Monohydrate
          { id: 'ing011', quantity: 20 },  // Hypromellose (HPMC)
          { id: 'ing012', quantity: 10 },  // Sodium Citrate
          { id: 'ing013', quantity: 15 }   // Glycerin
      ],
      equipmentNeeded: ['eq005', 'eq006', 'eq007'], // Magnetic Stirrer, Measuring Cylinders, Suspension Mixer
      productionTime: 25,
  },
  {
      id: 'pd004',
      name: 'Caffeine Citrate Tablet',
      description: 'Treats apnea in infants.',
      inventory: 0,
      suggestedPrice: 8.99,
      price: 8.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing014', quantity: 50 },  // Caffeine Citrate
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing003', quantity: 15 },  // Magnesium Stearate
          { id: 'ing015', quantity: 10 }   // Polyethylene Glycol 400
      ],
      equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
      productionTime: 18,
  },
  {
      id: 'pd005',
      name: 'Diphenhydramine Syrup',
      description: 'Allergy relief and sleep aid.',
      inventory: 0,
      suggestedPrice: 9.99,
      price: 9.99,
      dosageForm: 'syrup',
      ingredients: [
          { id: 'ing016', quantity: 150 }, // Diphenhydramine Base
          { id: 'ing013', quantity: 100 }, // Glycerin
          { id: 'ing012', quantity: 20 },  // Sodium Citrate
          { id: 'ing017', quantity: 5 }    // Ascorbic Acid
      ],
      equipmentNeeded: ['eq005', 'eq006', 'eq008'], // Magnetic Stirrer, Measuring Cylinders, Syrup Mixer
      productionTime: 30,
  },
  {
      id: 'pd006',
      name: 'Loratadine Tablet',
      description: 'Allergy symptom relief.',
      inventory: 0,
      suggestedPrice: 6.99,
      price: 6.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing018', quantity: 100 }, // Loratadine Base
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing003', quantity: 10 },  // Magnesium Stearate
          { id: 'ing004', quantity: 5 }    // Talc Powder
      ],
      equipmentNeeded: ['eq001', 'eq002'], // Mortar and Pestle, Tablet Press
      productionTime: 12,
  },
  {
      id: 'pd007',
      name: 'Guaifenesin Extended-Release Tablet',
      description: 'Chest congestion relief.',
      inventory: 0,
      suggestedPrice: 9.49,
      price: 9.49,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing019', quantity: 200 }, // Guaifenesin Powder
          { id: 'ing011', quantity: 50 },  // Hypromellose (HPMC)
          { id: 'ing002', quantity: 30 },  // Microcrystalline Cellulose
          { id: 'ing003', quantity: 20 }   // Magnesium Stearate
      ],
      equipmentNeeded: ['eq002', 'eq009', 'eq003'], // Tablet Press, Coating Pan, Powder Blender
      productionTime: 15,
  },
  {
      id: 'pd008',
      name: 'Omeprazole Enteric-Coated Tablet',
      description: 'Reduces stomach acid.',
      inventory: 0,
      suggestedPrice: 12.99,
      price: 12.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing020', quantity: 50 },  // Omeprazole Base
          { id: 'ing011', quantity: 25 },  // Hypromellose (HPMC)
          { id: 'ing003', quantity: 10 },  // Magnesium Stearate
          { id: 'ing004', quantity: 5 },   // Talc Powder
          { id: 'ing015', quantity: 5 }    // Polyethylene Glycol 400
      ],
      equipmentNeeded: ['eq002', 'eq009', 'eq003'], // Tablet Press, Coating Pan, Powder Blender
      productionTime: 20,
  },
  {
      id: 'pd009',
      name: 'Vitamin D3 Softgel Capsule',
      description: 'Supports bone health.',
      inventory: 0,
      suggestedPrice: 15.99,
      price: 15.99,
      dosageForm: 'capsule',
      ingredients: [
          { id: 'ing021', quantity: 100 }, // Vitamin D3 (Cholecalciferol)
          { id: 'ing006', quantity: 50 },  // Gelatin Caps
          { id: 'ing013', quantity: 25 }   // Glycerin
      ],
      equipmentNeeded: ['eq010', 'eq011'], // Capsule Filling Machine, Oil Mixer
      productionTime: 15,
  },
  {
      id: 'pd010',
      name: 'Aspirin Tablet',
      description: 'Pain and inflammation relief.',
      inventory: 0,
      suggestedPrice: 6.99,
      price: 6.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing022', quantity: 100 }, // Aspirin (Acetylsalicylic Acid)
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing004', quantity: 10 },  // Talc Powder
          { id: 'ing003', quantity: 5 }    // Magnesium Stearate
      ],
      equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
      productionTime: 15,
  },
  {
      id: 'pd011',
      name: 'Prednisolone Oral Suspension',
      description: 'Treats inflammation.',
      inventory: 0,
      suggestedPrice: 8.99,
      price: 8.99,
      dosageForm: 'suspension',
      ingredients: [
          { id: 'ing023', quantity: 100 }, // Prednisolone Acetate
          { id: 'ing013', quantity: 75 },  // Glycerin
          { id: 'ing011', quantity: 10 },  // Hypromellose (HPMC)
          { id: 'ing017', quantity: 5 }    // Ascorbic Acid
      ],
      equipmentNeeded: ['eq005', 'eq007', 'eq008'], // Magnetic Stirrer, Syrup Mixer, Measuring Cylinders
      productionTime: 30,
  },
  {
      id: 'pd012',
      name: 'Simethicone Chewable Tablet',
      description: 'Relieves gas and bloating.',
      inventory: 0,
      suggestedPrice: 5.49,
      price: 5.49,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing024', quantity: 200 }, // Simethicone Emulsion
          { id: 'ing010', quantity: 50 },  // Lactose Monohydrate
          { id: 'ing004', quantity: 10 },  // Talc Powder
          { id: 'ing003', quantity: 5 }    // Magnesium Stearate
      ],
      equipmentNeeded: ['eq002', 'eq001', 'eq003'], // Tablet Press, Mortar and Pestle, Powder Blender
      productionTime: 20,
  },
  {
      id: 'pd013',
      name: 'Hydrocortisone Cream',
      description: 'Reduces inflammation and itching.',
      inventory: 0,
      suggestedPrice: 12.99,
      price: 12.99,
      dosageForm: 'cream',
      ingredients: [
          { id: 'ing025', quantity: 100 }, // Hydrocortisone Base
          { id: 'ing015', quantity: 50 },  // Polyethylene Glycol 400
          { id: 'ing013', quantity: 30 },  // Glycerin
          { id: 'ing004', quantity: 10 }   // Talc Powder
      ],
      equipmentNeeded: ['eq012', 'eq013', 'eq014'], // Cream Mixer, Spatula, Ointment Mill
      productionTime: 25,
  },
  {
      id: 'pd014',
      name: 'Melatonin Sublingual Tablet',
      description: 'Regulates sleep patterns.',
      inventory: 0,
      suggestedPrice: 4.99,
      price: 4.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing026', quantity: 50 },  // Melatonin
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing003', quantity: 15 },  // Magnesium Stearate
          { id: 'ing004', quantity: 10 }   // Talc Powder
      ],
      equipmentNeeded: ['eq002', 'eq001', 'eq003'], // Tablet Press, Mortar and Pestle, Powder Blender
      productionTime: 15,
  },
  {
      id: 'pd015',
      name: 'Fexofenadine Tablet',
      description: 'Allergy relief.',
      inventory: 0,
      suggestedPrice: 7.99,
      price: 7.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing027', quantity: 100 }, // Fexofenadine HCl
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing003', quantity: 10 },  // Magnesium Stearate
          { id: 'ing004', quantity: 5 }    // Talc Powder
      ],
      equipmentNeeded: ['eq002', 'eq001', 'eq003'], // Tablet Press, Mortar and Pestle, Powder Blender
      productionTime: 15,
  },
  {
      id: 'pd016',
      name: 'Calcium Carbonate Antacid Tablet',
      description: 'Relieves heartburn.',
      inventory: 0,
      suggestedPrice: 6.99,
      price: 6.99,
      dosageForm: 'tablet',
      ingredients: [
          { id: 'ing028', quantity: 150 }, // Calcium Carbonate
          { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
          { id: 'ing004', quantity: 10 },  // Talc Powder
          { id: 'ing003', quantity: 5 }    // Magnesium Stearate
      ],
      equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
      productionTime: 20,
  }
  {
    id: 'pd017',
    name: 'Erythromycin Topical Gel',
    description: 'Treats acne.',
    inventory: 0,
    suggestedPrice: 9.99,
    price: 9.99,
    dosageForm: 'gel',
    ingredients: [
        { id: 'ing029', quantity: 100 }, // Erythromycin Base
        { id: 'ing013', quantity: 50 },  // Glycerin
        { id: 'ing015', quantity: 25 },  // Polyethylene Glycol 400
        { id: 'ing011', quantity: 10 }   // Hypromellose (HPMC)
    ],
    equipmentNeeded: ['eq012', 'eq013'], // Gel Mixer, Ointment Mill
    productionTime: 20,
},
{
    id: 'pd018',
    name: 'Lidocaine Injectable Solution',
    description: 'Local anesthetic.',
    inventory: 0,
    suggestedPrice: 15.99,
    price: 15.99,
    dosageForm: 'injectable',
    ingredients: [
        { id: 'ing030', quantity: 100 }, // Lidocaine HCl
        { id: 'ing031', quantity: 5 },   // Sodium Chloride
        { id: 'ing032', quantity: 20 }   // Water for Injection (WFI)
    ],
    equipmentNeeded: ['eq015', 'eq016'], // Sterile Mixing Equipment, Autoclave
    productionTime: 30,
},
{
    id: 'pd019',
    name: 'Chlorhexidine Mouthwash',
    description: 'Antiseptic.',
    inventory: 0,
    suggestedPrice: 7.99,
    price: 7.99,
    dosageForm: 'mouthwash',
    ingredients: [
        { id: 'ing033', quantity: 100 }, // Chlorhexidine Gluconate
        { id: 'ing013', quantity: 50 },  // Glycerin
        { id: 'ing012', quantity: 10 }   // Sodium Citrate
    ],
    equipmentNeeded: ['eq005', 'eq006'], // Magnetic Stirrer, Measuring Cylinders
    productionTime: 20,
},
{
    id: 'pd020',
    name: 'Ibuprofen Gel',
    description: 'Topical pain relief.',
    inventory: 0,
    suggestedPrice: 9.49,
    price: 9.49,
    dosageForm: 'gel',
    ingredients: [
        { id: 'ing005', quantity: 200 }, // Ibuprofen Powder
        { id: 'ing013', quantity: 100 }, // Glycerin
        { id: 'ing015', quantity: 20 }   // Polyethylene Glycol 400
    ],
    equipmentNeeded: ['eq012', 'eq013'], // Gel Mixer, Spatula
    productionTime: 15,
},
{
    id: 'pd021',
    name: 'Ranitidine Tablet',
    description: 'Reduces stomach acid.',
    inventory: 0,
    suggestedPrice: 6.49,
    price: 6.49,
    dosageForm: 'tablet',
    ingredients: [
        { id: 'ing034', quantity: 100 }, // Ranitidine Base
        { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
        { id: 'ing003', quantity: 10 },  // Magnesium Stearate
        { id: 'ing004', quantity: 5 }    // Talc Powder
    ],
    equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
    productionTime: 15,
},
{
    id: 'pd022',
    name: 'Metformin Tablet',
    description: 'Controls blood sugar levels.',
    inventory: 0,
    suggestedPrice: 8.99,
    price: 8.99,
    dosageForm: 'tablet',
    ingredients: [
        { id: 'ing035', quantity: 150 }, // Metformin Hydrochloride
        { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
        { id: 'ing003', quantity: 10 },  // Magnesium Stearate
        { id: 'ing004', quantity: 5 }    // Talc Powder
    ],
    equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
    productionTime: 15,
},
{
    id: 'pd023',
    name: 'Amiodarone Tablet',
    description: 'Treats irregular heartbeats.',
    inventory: 0,
    suggestedPrice: 14.99,
    price: 14.99,
    dosageForm: 'tablet',
    ingredients: [
        { id: 'ing036', quantity: 200 }, // Amiodarone HCl
        { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
        { id: 'ing003', quantity: 10 },  // Magnesium Stearate
        { id: 'ing004', quantity: 5 }    // Talc Powder
    ],
    equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
    productionTime: 18,
},
{
    id: 'pd024',
    name: 'Dextromethorphan Syrup',
    description: 'Cough suppressant.',
    inventory: 0,
    suggestedPrice: 7.99,
    price: 7.99,
    dosageForm: 'syrup',
    ingredients: [
        { id: 'ing037', quantity: 150 }, // Dextromethorphan HBr
        { id: 'ing013', quantity: 75 },  // Glycerin
        { id: 'ing012', quantity: 15 },  // Sodium Citrate
        { id: 'ing017', quantity: 5 }    // Ascorbic Acid
    ],
    equipmentNeeded: ['eq008', 'eq006'], // Syrup Mixer, Measuring Cylinders
    productionTime: 25,
},
{
    id: 'pd025',
    name: 'Ciprofloxacin Suspension',
    description: 'Antibiotic for infections.',
    inventory: 0,
    suggestedPrice: 9.49,
    price: 9.49,
    dosageForm: 'suspension',
    ingredients: [
        { id: 'ing038', quantity: 200 }, // Ciprofloxacin Hydrochloride
        { id: 'ing010', quantity: 50 },  // Lactose Monohydrate
        { id: 'ing011', quantity: 20 },  // Hypromellose (HPMC)
        { id: 'ing013', quantity: 25 }   // Glycerin
    ],
    equipmentNeeded: ['eq007', 'eq005'], // Suspension Mixer, Magnetic Stirrer
    productionTime: 30,
},
{
    id: 'pd026',
    name: 'Famotidine Tablet',
    description: 'Treats acid reflux.',
    inventory: 0,
    suggestedPrice: 6.49,
    price: 6.49,
    dosageForm: 'tablet',
    ingredients: [
        { id: 'ing039', quantity: 150 }, // Famotidine Base
        { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
        { id: 'ing003', quantity: 10 },  // Magnesium Stearate
        { id: 'ing004', quantity: 5 }    // Talc Powder
    ],
    equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
    productionTime: 15,
},
{
    id: 'pd027',
    name: 'Clindamycin Gel',
    description: 'Treats bacterial skin infections.',
    inventory: 0,
    suggestedPrice: 9.99,
    price: 9.99,
    dosageForm: 'gel',
    ingredients: [
        { id: 'ing040', quantity: 150 }, // Clindamycin Phosphate
        { id: 'ing013', quantity: 75 },  // Glycerin
        { id: 'ing011', quantity: 25 },  // Hypromellose (HPMC)
        { id: 'ing015', quantity: 10 }   // Polyethylene Glycol 400
    ],
    equipmentNeeded: ['eq012', 'eq013'], // Gel Mixer, Ointment Mill
    productionTime: 25,
},
{
    id: 'pd028',
    name: 'Folic Acid Tablet',
    description: 'Supports red blood cell production.',
    inventory: 0,
    suggestedPrice: 5.99,
    price: 5.99,
    dosageForm: 'tablet',
    ingredients: [
        { id: 'ing041', quantity: 100 }, // Folic Acid
        { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
        { id: 'ing003', quantity: 10 },  // Magnesium Stearate
        { id: 'ing004', quantity: 5 }    // Talc Powder
    ],
    equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
    productionTime: 15,
}
{
  id: 'pd033',
  name: 'Albuterol Inhalation Solution',
  description: 'Relieves asthma symptoms.',
  inventory: 0,
  suggestedPrice: 12.99,
  price: 12.99,
  dosageForm: 'inhalation solution',
  ingredients: [
      { id: 'ing042', quantity: 100 }, // Albuterol Sulfate
      { id: 'ing031', quantity: 5 },   // Sodium Chloride
      { id: 'ing032', quantity: 20 }   // Water for Injection
  ],
  equipmentNeeded: ['eq015', 'eq016'], // Sterile Mixing Equipment, Autoclave
  productionTime: 30,
},
{
  id: 'pd034',
  name: 'Tetracycline Capsule',
  description: 'Antibiotic for infections.',
  inventory: 0,
  suggestedPrice: 9.99,
  price: 9.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing043', quantity: 200 }, // Tetracycline Hydrochloride
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq004', 'eq003', 'eq001'], // Capsule Filler, Powder Blender, Mortar and Pestle
  productionTime: 20,
},
{
  id: 'pd035',
  name: 'Cetirizine Tablet',
  description: 'Allergy symptom relief.',
  inventory: 0,
  suggestedPrice: 7.99,
  price: 7.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing044', quantity: 100 }, // Cetirizine Dihydrochloride
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001', 'eq003'], // Tablet Press, Mortar and Pestle, Powder Blender
  productionTime: 15,
},
{
  id: 'pd036',
  name: 'Simvastatin Tablet',
  description: 'Lowers cholesterol.',
  inventory: 0,
  suggestedPrice: 8.99,
  price: 8.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing045', quantity: 100 }, // Simvastatin Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd037',
  name: 'Amlodipine Tablet',
  description: 'Treats high blood pressure.',
  inventory: 0,
  suggestedPrice: 10.99,
  price: 10.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing046', quantity: 150 }, // Amlodipine Besylate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 20,
},
{
  id: 'pd038',
  name: 'Lansoprazole Capsule',
  description: 'Reduces stomach acid.',
  inventory: 0,
  suggestedPrice: 12.99,
  price: 12.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing047', quantity: 100 }, // Lansoprazole Base
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing011', quantity: 15 },  // Hypromellose (HPMC)
      { id: 'ing004', quantity: 10 }   // Talc Powder
  ],
  equipmentNeeded: ['eq004', 'eq003'], // Capsule Filler, Powder Blender
  productionTime: 20,
},
{
  id: 'pd039',
  name: 'Levofloxacin Tablet',
  description: 'Antibiotic for bacterial infections.',
  inventory: 0,
  suggestedPrice: 14.99,
  price: 14.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing048', quantity: 200 }, // Levofloxacin Hemihydrate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 20,
},
{
  id: 'pd040',
  name: 'Propranolol Tablet',
  description: 'Treats high blood pressure.',
  inventory: 0,
  suggestedPrice: 8.49,
  price: 8.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing049', quantity: 150 }, // Propranolol HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 18,
},
{
  id: 'pd041',
  name: 'Diclofenac Gel',
  description: 'Topical anti-inflammatory.',
  inventory: 0,
  suggestedPrice: 12.99,
  price: 12.99,
  dosageForm: 'gel',
  ingredients: [
      { id: 'ing050', quantity: 200 }, // Diclofenac Sodium
      { id: 'ing013', quantity: 100 }, // Glycerin
      { id: 'ing015', quantity: 25 }   // Polyethylene Glycol 400
  ],
  equipmentNeeded: ['eq012', 'eq013'], // Gel Mixer, Spatula
  productionTime: 20,
},
{
  id: 'pd042',
  name: 'Lorazepam Tablet',
  description: 'Treats anxiety disorders.',
  inventory: 0,
  suggestedPrice: 7.99,
  price: 7.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing051', quantity: 100 }, // Lorazepam Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd043',
  name: 'Fluoxetine Capsule',
  description: 'Antidepressant.',
  inventory: 0,
  suggestedPrice: 14.99,
  price: 14.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing052', quantity: 200 }, // Fluoxetine HCl
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing003', quantity: 15 },  // Magnesium Stearate
      { id: 'ing004', quantity: 10 }   // Talc Powder
  ],
  equipmentNeeded: ['eq004', 'eq003'], // Capsule Filler, Powder Blender
  productionTime: 20,
},
{
  id: 'pd044',
  name: 'Diltiazem Tablet',
  description: 'Treats hypertension.',
  inventory: 0,
  suggestedPrice: 9.99,
  price: 9.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing053', quantity: 150 }, // Diltiazem HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd045',
  name: 'Warfarin Tablet',
  description: 'Prevents blood clots.',
  inventory: 0,
  suggestedPrice: 10.49,
  price: 10.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing054', quantity: 100 }, // Warfarin Sodium
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 20,
}
{
  id: 'pd050',
  name: 'Clopidogrel Tablet',
  description: 'Prevents stroke and heart attack.',
  inventory: 0,
  suggestedPrice: 13.99,
  price: 13.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing055', quantity: 150 }, // Clopidogrel Bisulfate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 18,
},
{
  id: 'pd051',
  name: 'Esomeprazole Capsule',
  description: 'Treats GERD.',
  inventory: 0,
  suggestedPrice: 14.99,
  price: 14.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing056', quantity: 100 }, // Esomeprazole Magnesium
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing011', quantity: 20 },  // Hypromellose (HPMC)
      { id: 'ing004', quantity: 10 }   // Talc Powder
  ],
  equipmentNeeded: ['eq004', 'eq003'], // Capsule Filler, Powder Blender
  productionTime: 20,
},
{
  id: 'pd052',
  name: 'Atorvastatin Tablet',
  description: 'Lowers cholesterol.',
  inventory: 0,
  suggestedPrice: 10.49,
  price: 10.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing057', quantity: 100 }, // Atorvastatin Calcium
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd053',
  name: 'Paracetamol Syrup',
  description: 'Pain and fever relief.',
  inventory: 0,
  suggestedPrice: 5.99,
  price: 5.99,
  dosageForm: 'syrup',
  ingredients: [
      { id: 'ing058', quantity: 150 }, // Paracetamol Base
      { id: 'ing013', quantity: 100 }, // Glycerin
      { id: 'ing012', quantity: 15 },  // Sodium Citrate
      { id: 'ing017', quantity: 5 }    // Ascorbic Acid
  ],
  equipmentNeeded: ['eq008', 'eq006'], // Syrup Mixer, Measuring Cylinders
  productionTime: 30,
},
{
  id: 'pd054',
  name: 'Hydrocortisone Lotion',
  description: 'Relieves skin irritation.',
  inventory: 0,
  suggestedPrice: 11.99,
  price: 11.99,
  dosageForm: 'lotion',
  ingredients: [
      { id: 'ing025', quantity: 100 }, // Hydrocortisone Base
      { id: 'ing013', quantity: 50 },  // Glycerin
      { id: 'ing015', quantity: 25 },  // Polyethylene Glycol 400
      { id: 'ing032', quantity: 30 }   // Water
  ],
  equipmentNeeded: ['eq017', 'eq018'], // Lotion Mixer, Spatula
  productionTime: 25,
},
{
  id: 'pd055',
  name: 'Prednisone Tablet',
  description: 'Reduces inflammation.',
  inventory: 0,
  suggestedPrice: 7.99,
  price: 7.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing059', quantity: 100 }, // Prednisone Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd056',
  name: 'Ondansetron ODT',
  description: 'Prevents nausea and vomiting.',
  inventory: 0,
  suggestedPrice: 8.49,
  price: 8.49,
  dosageForm: 'odt',
  ingredients: [
      { id: 'ing060', quantity: 100 }, // Ondansetron HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd057',
  name: 'Sodium Bicarbonate Antacid',
  description: 'Relieves acid indigestion.',
  inventory: 0,
  suggestedPrice: 6.99,
  price: 6.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing061', quantity: 200 }, // Sodium Bicarbonate
      { id: 'ing004', quantity: 50 },  // Talc Powder
      { id: 'ing003', quantity: 10 }   // Magnesium Stearate
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 20,
},
{
  id: 'pd058',
  name: 'Vitamin B12 Injection',
  description: 'Treats B12 deficiency.',
  inventory: 0,
  suggestedPrice: 19.99,
  price: 19.99,
  dosageForm: 'injectable',
  ingredients: [
      { id: 'ing062', quantity: 100 }, // Vitamin B12 (Cyanocobalamin)
      { id: 'ing031', quantity: 5 },   // Sodium Chloride
      { id: 'ing032', quantity: 20 }   // Water for Injection
  ],
  equipmentNeeded: ['eq015', 'eq016'], // Sterile Mixing Equipment, Autoclave
  productionTime: 25,
},
{
  id: 'pd059',
  name: 'Alprazolam Tablet',
  description: 'Treats anxiety disorders.',
  inventory: 0,
  suggestedPrice: 7.99,
  price: 7.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing063', quantity: 100 }, // Alprazolam Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd060',
  name: 'Sertraline Capsule',
  description: 'Antidepressant.',
  inventory: 0,
  suggestedPrice: 10.99,
  price: 10.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing064', quantity: 200 }, // Sertraline HCl
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing004', quantity: 10 },  // Talc Powder
      { id: 'ing003', quantity: 5 }    // Magnesium Stearate
  ],
  equipmentNeeded: ['eq004', 'eq001'], // Capsule Filler, Mortar and Pestle
  productionTime: 20,
},
{
  id: 'pd061',
  name: 'Nitroglycerin Sublingual Tablet',
  description: 'Treats chest pain (angina).',
  inventory: 0,
  suggestedPrice: 9.99,
  price: 9.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing065', quantity: 100 }, // Nitroglycerin Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd062',
  name: 'Salbutamol Inhaler',
  description: 'Relieves asthma symptoms.',
  inventory: 0,
  suggestedPrice: 15.99,
  price: 15.99,
  dosageForm: 'inhaler',
  ingredients: [
      { id: 'ing066', quantity: 100 }, // Salbutamol Sulfate
      { id: 'ing067', quantity: 50 },  // Propellant
  ],
  equipmentNeeded: ['eq019'], // Inhaler Filling Machine
  productionTime: 30,
}
{
  id: 'pd067',
  name: 'Ketorolac Injection',
  description: 'Pain relief.',
  inventory: 0,
  suggestedPrice: 16.99,
  price: 16.99,
  dosageForm: 'injectable',
  ingredients: [
      { id: 'ing068', quantity: 100 }, // Ketorolac Tromethamine
      { id: 'ing031', quantity: 5 },   // Sodium Chloride
      { id: 'ing032', quantity: 20 }   // Water for Injection
  ],
  equipmentNeeded: ['eq015', 'eq016'], // Sterile Mixing Equipment, Autoclave
  productionTime: 30,
},
{
  id: 'pd068',
  name: 'Levothyroxine Tablet',
  description: 'Treats hypothyroidism.',
  inventory: 0,
  suggestedPrice: 11.99,
  price: 11.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing069', quantity: 100 }, // Levothyroxine Sodium
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd069',
  name: 'Methylprednisolone Tablet',
  description: 'Reduces inflammation.',
  inventory: 0,
  suggestedPrice: 9.99,
  price: 9.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing070', quantity: 100 }, // Methylprednisolone Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd070',
  name: 'Metronidazole Gel',
  description: 'Treats bacterial infections.',
  inventory: 0,
  suggestedPrice: 12.99,
  price: 12.99,
  dosageForm: 'gel',
  ingredients: [
      { id: 'ing071', quantity: 150 }, // Metronidazole Base
      { id: 'ing013', quantity: 75 },  // Glycerin
      { id: 'ing015', quantity: 25 },  // Polyethylene Glycol 400
      { id: 'ing011', quantity: 10 }   // Hypromellose (HPMC)
  ],
  equipmentNeeded: ['eq012', 'eq013'], // Gel Mixer, Spatula
  productionTime: 25,
},
{
  id: 'pd071',
  name: 'Calcium Citrate Tablet',
  description: 'Supports bone health.',
  inventory: 0,
  suggestedPrice: 7.99,
  price: 7.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing072', quantity: 150 }, // Calcium Citrate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd072',
  name: 'Vitamin E Softgel Capsule',
  description: 'Antioxidant.',
  inventory: 0,
  suggestedPrice: 9.49,
  price: 9.49,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing073', quantity: 100 }, // Vitamin E (Alpha-Tocopherol)
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing013', quantity: 30 }   // Glycerin
  ],
  equipmentNeeded: ['eq010', 'eq011'], // Capsule Filling Machine, Oil Mixer
  productionTime: 15,
},
{
  id: 'pd073',
  name: 'Clonazepam Tablet',
  description: 'Treats seizures and panic disorders.',
  inventory: 0,
  suggestedPrice: 8.99,
  price: 8.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing074', quantity: 100 }, // Clonazepam Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd074',
  name: 'Bupropion Tablet',
  description: 'Antidepressant and smoking cessation aid.',
  inventory: 0,
  suggestedPrice: 10.99,
  price: 10.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing075', quantity: 100 }, // Bupropion HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd075',
  name: 'Trazodone Tablet',
  description: 'Treats depression and anxiety.',
  inventory: 0,
  suggestedPrice: 9.49,
  price: 9.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing076', quantity: 100 }, // Trazodone HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd076',
  name: 'Mirtazapine Tablet',
  description: 'Antidepressant.',
  inventory: 0,
  suggestedPrice: 7.99,
  price: 7.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing077', quantity: 100 }, // Mirtazapine Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd077',
  name: 'Escitalopram Tablet',
  description: 'Treats depression and anxiety.',
  inventory: 0,
  suggestedPrice: 10.99,
  price: 10.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing078', quantity: 100 }, // Escitalopram Oxalate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd078',
  name: 'Duloxetine Capsule',
  description: 'Treats depression and chronic pain.',
  inventory: 0,
  suggestedPrice: 13.49,
  price: 13.49,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing079', quantity: 150 }, // Duloxetine HCl
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing011', quantity: 20 },  // Hypromellose (HPMC)
      { id: 'ing003', quantity: 10 }   // Magnesium Stearate
  ],
  equipmentNeeded: ['eq004', 'eq003'], // Capsule Filler, Powder Blender
  productionTime: 20,
},
{
  id: 'pd079',
  name: 'Venlafaxine Capsule',
  description: 'Treats depression and anxiety disorders.',
  inventory: 0,
  suggestedPrice: 13.99,
  price: 13.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing080', quantity: 200 }, // Venlafaxine HCl
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing004', quantity: 5 },   // Talc Powder
      { id: 'ing003', quantity: 5 }    // Magnesium Stearate
  ],
  equipmentNeeded: ['eq004', 'eq001'], // Capsule Filler, Mortar and Pestle
  productionTime: 20,
}
{
  id: 'pd084',
  name: 'Lithium Carbonate Tablet',
  description: 'Treats bipolar disorder.',
  inventory: 0,
  suggestedPrice: 14.99,
  price: 14.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing081', quantity: 200 }, // Lithium Carbonate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 20,
},
{
  id: 'pd085',
  name: 'Buspirone Tablet',
  description: 'Treats anxiety disorders.',
  inventory: 0,
  suggestedPrice: 9.49,
  price: 9.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing082', quantity: 100 }, // Buspirone HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd086',
  name: 'Sumatriptan Tablet',
  description: 'Treats migraine headaches.',
  inventory: 0,
  suggestedPrice: 12.99,
  price: 12.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing083', quantity: 200 }, // Sumatriptan Succinate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 20,
},
{
  id: 'pd087',
  name: 'Zolmitriptan Tablet',
  description: 'Treats migraines.',
  inventory: 0,
  suggestedPrice: 11.49,
  price: 11.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing084', quantity: 200 }, // Zolmitriptan Base
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Mortar and Pestle
  productionTime: 20,
},
{
  id: 'pd088',
  name: 'Prochlorperazine Tablet',
  description: 'Treats nausea and vomiting.',
  inventory: 0,
  suggestedPrice: 10.49,
  price: 10.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing085', quantity: 200 }, // Prochlorperazine Maleate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 20,
},
{
  id: 'pd089',
  name: 'Ondansetron Injection',
  description: 'Prevents nausea and vomiting.',
  inventory: 0,
  suggestedPrice: 18.99,
  price: 18.99,
  dosageForm: 'injectable',
  ingredients: [
      { id: 'ing060', quantity: 150 }, // Ondansetron HCl
      { id: 'ing031', quantity: 5 },   // Sodium Chloride
      { id: 'ing032', quantity: 20 }   // Water for Injection
  ],
  equipmentNeeded: ['eq015', 'eq016'], // Sterile Mixing Equipment, Autoclave
  productionTime: 30,
},
{
  id: 'pd090',
  name: 'Fexofenadine Tablet',
  description: 'Relieves allergy symptoms.',
  inventory: 0,
  suggestedPrice: 7.49,
  price: 7.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing027', quantity: 100 }, // Fexofenadine HCl
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq001'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd091',
  name: 'Montelukast Tablet',
  description: 'Treats asthma and allergies.',
  inventory: 0,
  suggestedPrice: 8.99,
  price: 8.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing086', quantity: 200 }, // Montelukast Sodium
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
},
{
  id: 'pd092',
  name: 'Albuterol Tablet',
  description: 'Treats asthma symptoms.',
  inventory: 0,
  suggestedPrice: 8.99,
  price: 8.99,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing066', quantity: 100 }, // Albuterol Sulfate
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Mortar and Pestle
  productionTime: 15,
},
{
  id: 'pd093',
  name: 'Tiotropium Capsule',
  description: 'Treats COPD.',
  inventory: 0,
  suggestedPrice: 15.99,
  price: 15.99,
  dosageForm: 'capsule',
  ingredients: [
      { id: 'ing087', quantity: 100 }, // Tiotropium Bromide
      { id: 'ing006', quantity: 50 },  // Gelatin Caps
      { id: 'ing004', quantity: 10 },  // Talc Powder
      { id: 'ing003', quantity: 5 }    // Magnesium Stearate
  ],
  equipmentNeeded: ['eq004', 'eq003'], // Capsule Filler, Powder Blender
  productionTime: 20,
},
{
  id: 'pd094',
  name: 'Budesonide Inhaler',
  description: 'Treats asthma and COPD.',
  inventory: 0,
  suggestedPrice: 19.99,
  price: 19.99,
  dosageForm: 'inhaler',
  ingredients: [
      { id: 'ing088', quantity: 100 }, // Budesonide Base
      { id: 'ing067', quantity: 50 },  // Propellant
  ],
  equipmentNeeded: ['eq019'], // Inhaler Filling Machine
  productionTime: 30,
},
{
  id: 'pd095',
  name: 'Fluticasone Nasal Spray',
  description: 'Treats nasal congestion and allergies.',
  inventory: 0,
  suggestedPrice: 10.99,
  price: 10.99,
  dosageForm: 'nasal spray',
  ingredients: [
      { id: 'ing089', quantity: 100 }, // Fluticasone Propionate
      { id: 'ing013', quantity: 50 },  // Glycerin
      { id: 'ing032', quantity: 25 }   // Water
  ],
  equipmentNeeded: ['eq020'], // Nasal Spray Filling Machine
  productionTime: 20,
},
{
  id: 'pd096',
  name: 'Beclomethasone Inhaler',
  description: 'Prevents asthma symptoms.',
  inventory: 0,
  suggestedPrice: 14.99,
  price: 14.99,
  dosageForm: 'inhaler',
  ingredients: [
      { id: 'ing090', quantity: 100 }, // Beclomethasone Dipropionate
      { id: 'ing067', quantity: 50 },  // Propellant
  ],
  equipmentNeeded: ['eq019'], // Inhaler Filling Machine
  productionTime: 30,
},
{
  id: 'pd097',
  name: 'Betahistine Tablet',
  description: 'Treats vertigo.',
  inventory: 0,
  suggestedPrice: 8.49,
  price: 8.49,
  dosageForm: 'tablet',
  ingredients: [
      { id: 'ing091', quantity: 100 }, // Betahistine Dihydrochloride
      { id: 'ing002', quantity: 50 },  // Microcrystalline Cellulose
      { id: 'ing003', quantity: 10 },  // Magnesium Stearate
      { id: 'ing004', quantity: 5 }    // Talc Powder
  ],
  equipmentNeeded: ['eq002', 'eq003'], // Tablet Press, Powder Blender
  productionTime: 15,
}
];



