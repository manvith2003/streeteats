// Rich demo dataset so the app looks alive without the backend running.
// Bengaluru-ish coordinates around MG Road.
export const CATEGORIES = [
  { key: 'all',    label: 'All',     emoji: '🍽️' },
  { key: 'chaat',  label: 'Chaat',   emoji: '🥘' },
  { key: 'dosa',   label: 'Dosa',    emoji: '🥞' },
  { key: 'momos',  label: 'Momos',   emoji: '🥟' },
  { key: 'juice',  label: 'Juice',   emoji: '🥤' },
  { key: 'rolls',  label: 'Rolls',   emoji: '🌯' },
  { key: 'sweets', label: 'Sweets',  emoji: '🍮' },
  { key: 'tea',    label: 'Chai',    emoji: '☕' },
]

const grad = ['linear-gradient(135deg,#ffd194,#fc6a2d)','linear-gradient(135deg,#a1ffce,#1faa59)',
  'linear-gradient(135deg,#fbc2eb,#a18cd1)','linear-gradient(135deg,#84fab0,#8fd3f4)',
  'linear-gradient(135deg,#ffecd2,#fcb69f)','linear-gradient(135deg,#f6d365,#fda085)']
export const bg = i => grad[i % grad.length]

export const DEMO = [
  { id:'d1', name:'Sharma Chaat Bhandar', cuisine:'chaat', emoji:'🥘', veg:true,
    lat:12.9752, lng:77.6050, state:'OPEN', minutesSinceConfirmed:4, averageRating:4.5, reviewCount:128,
    priceForTwo:120, source:'COMMUNITY_ADDED', verified:false,
    menuItems:[{name:'Pani Puri',price:30,special:true},{name:'Bhel Puri',price:40},
               {name:'Sev Puri',price:45},{name:'Dahi Puri',price:50,soldOut:true}],
    reviews:[{who:'Aarti',rating:5,cmt:'Best pani puri in the area, super fresh!'},
             {who:'Karthik',rating:4,cmt:'Tasty but gets crowded in evening.'}]},
  { id:'d2', name:'Dosa Express Cart', cuisine:'dosa', emoji:'🥞', veg:true,
    lat:12.9730, lng:77.6075, state:'MOVING', minutesSinceConfirmed:12, averageRating:4.2, reviewCount:64,
    priceForTwo:150, source:'VENDOR_ADDED', verified:true,
    menuItems:[{name:'Masala Dosa',price:60},{name:'Plain Dosa',price:45},{name:'Onion Uttapam',price:70,special:true}],
    reviews:[{who:'Reshma',rating:4,cmt:'Crispy dosa, generous masala.'}]},
  { id:'d3', name:'Momo Junction', cuisine:'momos', emoji:'🥟', veg:false,
    lat:12.9768, lng:77.6022, state:'OPEN', minutesSinceConfirmed:1, averageRating:4.7, reviewCount:212,
    priceForTwo:180, source:'COMMUNITY_ADDED', verified:false,
    menuItems:[{name:'Steamed Chicken Momo',price:90},{name:'Veg Momo',price:70},{name:'Fried Momo',price:100,special:true}],
    reviews:[{who:'Dev',rating:5,cmt:'Juicy momos and fiery chutney 🔥'},
             {who:'Sana',rating:5,cmt:'My go-to after work.'}]},
  { id:'d4', name:'Fresh Juice Wala', cuisine:'juice', emoji:'🥤', veg:true,
    lat:12.9715, lng:77.6035, state:'OPEN', minutesSinceConfirmed:7, averageRating:4.4, reviewCount:41,
    priceForTwo:100, source:'VENDOR_ADDED', verified:true,
    menuItems:[{name:'Mosambi Juice',price:50},{name:'Watermelon',price:40},{name:'Sugarcane',price:30}],
    reviews:[{who:'Imran',rating:4,cmt:'Cold and fresh, no added sugar.'}]},
  { id:'d5', name:'Kolkata Roll Corner', cuisine:'rolls', emoji:'🌯', veg:false,
    lat:12.9740, lng:77.5995, state:'CLOSED', minutesSinceConfirmed:200, averageRating:4.1, reviewCount:88,
    priceForTwo:160, source:'COMMUNITY_ADDED', verified:false,
    menuItems:[{name:'Egg Roll',price:60},{name:'Chicken Roll',price:90},{name:'Paneer Roll',price:80}],
    reviews:[{who:'Megha',rating:4,cmt:'Authentic Kolkata style rolls.'}]},
  { id:'d6', name:'Annapurna Sweets', cuisine:'sweets', emoji:'🍮', veg:true,
    lat:12.9722, lng:77.6065, state:'OPEN', minutesSinceConfirmed:20, averageRating:4.6, reviewCount:156,
    priceForTwo:140, source:'VENDOR_ADDED', verified:true,
    menuItems:[{name:'Jalebi (250g)',price:80,special:true},{name:'Gulab Jamun',price:60},{name:'Mysore Pak',price:90}],
    reviews:[{who:'Lata',rating:5,cmt:'Hot jalebis in the evening — heaven.'}]},
]
