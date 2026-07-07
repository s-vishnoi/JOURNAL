const table=document.getElementById('trackerTable')
const monthSelect=document.getElementById('monthSelect')
const yearSelect=document.getElementById('yearSelect')
const monthTitle=document.getElementById('monthTitle')
const farsiWordOfDay=document.getElementById('farsiWordOfDay')
const backupBtn=document.getElementById('backupBtn')
const restoreBtn=document.getElementById('restoreBtn')
const restoreInput=document.getElementById('restoreInput')
const dailyList=document.getElementById('dailyList')
const todayHeading=document.getElementById('todayHeading')
const dailyMood=document.getElementById('dailyMood')
const prevDayBtn=document.getElementById('prevDayBtn')
const nextDayBtn=document.getElementById('nextDayBtn')
const todayBtn=document.getElementById('todayBtn')
const monthlyGoals=document.getElementById('monthlyGoals')
const monthlyExcited=document.getElementById('monthlyExcited')
const monthlyChecklist=document.getElementById('monthlyChecklist')
const dreamsBtn=document.getElementById('dreamsBtn')
const dreamModal=document.getElementById('dreamModal')
const dreamBackdrop=document.getElementById('dreamBackdrop')
const dreamClose=document.getElementById('dreamClose')
const dreamText=document.getElementById('dreamText')
const dreamTitle=document.getElementById('dreamTitle')
const journalBtn=document.getElementById('journalBtn')
const journalModal=document.getElementById('journalModal')
const journalBackdrop=document.getElementById('journalBackdrop')
const journalClose=document.getElementById('journalClose')
const journalText=document.getElementById('journalText')
const journalTitle=document.getElementById('journalTitle')
const gratefulBtn=document.getElementById('gratefulBtn')
const gratefulModal=document.getElementById('gratefulModal')
const gratefulBackdrop=document.getElementById('gratefulBackdrop')
const gratefulClose=document.getElementById('gratefulClose')
const gratefulInputs=Array.from(document.querySelectorAll('.grateful-input'))
const gratefulTitle=document.getElementById('gratefulTitle')
const simpleTodoBtn=document.getElementById('simpleTodoBtn')
const simpleTodoModal=document.getElementById('simpleTodoModal')
const simpleTodoBackdrop=document.getElementById('simpleTodoBackdrop')
const simpleTodoClose=document.getElementById('simpleTodoClose')
const addHabitBtn=document.getElementById('addHabitBtn')
const habitModal=document.getElementById('habitModal')
const habitBackdrop=document.getElementById('habitBackdrop')
const habitTitle=document.getElementById('habitTitle')
const habitNameInput=document.getElementById('habitNameInput')
const habitIconInput=document.getElementById('habitIconInput')
const habitColorSelect=document.getElementById('habitColorSelect')
const habitColorPreview=document.getElementById('habitColorPreview')
const habitDelete=document.getElementById('habitDelete')
const habitSave=document.getElementById('habitSave')
const habitCancel=document.getElementById('habitCancel')
const contextMenu=document.getElementById('contextMenu')
const etherealToast=document.getElementById('etherealToast')
const cloudEmail=document.getElementById('cloudEmail')
const cloudPassword=document.getElementById('cloudPassword')
const cloudLoginBtn=document.getElementById('cloudLoginBtn')
const cloudSignInBtn=document.getElementById('cloudSignInBtn')
const signUpLink=document.getElementById('signUpLink')
const cloudLogoutBtn=document.getElementById('cloudLogoutBtn')
const cloudStatus=document.getElementById('cloudStatus')
const loginStatus=document.getElementById('loginStatus')
const loginOverlay=document.getElementById('loginOverlay')

let isSignUp = false

const months=['January','February','March','April','May','June','July','August','September','October','November','December']
const farsiWordsOfDay=[
  {fa:'آرامش',en:'calm',pronunciation:'aa-raa-mesh'},
  {fa:'مهربانی',en:'kindness',pronunciation:'mehr-bah-nee'},
  {fa:'دوستی',en:'friendship',pronunciation:'doos-tee'},
  {fa:'شادی',en:'joy',pronunciation:'shaa-dee'},
  {fa:'امید',en:'hope',pronunciation:'o-meed'},
  {fa:'رویا',en:'dream',pronunciation:'rooyaa'},
  {fa:'نور',en:'light',pronunciation:'noor'},
  {fa:'لبخند',en:'smile',pronunciation:'lab-khand'},
  {fa:'سپاس',en:'gratitude',pronunciation:'se-paas'},
  {fa:'شکوفه',en:'blossom',pronunciation:'sho-koo-feh'},
  {fa:'لطافت',en:'softness',pronunciation:'la-ta-fat'},
  {fa:'دلگرمی',en:'warmth',pronunciation:'del-ga-remi'}
]
const weekdays=['sun','mon','tue','wed','thu','fri','sat']
const DAILY_LINES=12
const DEFAULT_VISIBLE_DAILY_LINES=5
const EVENTS_LINES=3
const MONTHLY_TODO_DEFAULT_LINES=2
const MAX_OFF_DAYS_PER_MONTH=5
const TOTAL_UPDATE_DELAY_MS=1000
const MOODS=['😊','💪','👍','😢','😴','🤞','🤒']
const LOCAL_BACKUP_PREFIX='habit-plus-v4-backup-'
const HABIT_COLORS=[
  {value:'#0f9d7a',dot:'🟢'},
  {value:'#2d46b9',dot:'🔵'},
  {value:'#ff7a00',dot:'🟠'},
  {value:'#c11f7a',dot:'🟣'},
  {value:'#d63a2f',dot:'🔴'}
]
const LEGACY_HABIT_COLORS=['#7986cb','#33b679','#f6bf26','#039be5','#e67c73']
const DEFAULT_HABIT_COLOR=HABIT_COLORS[0].value
const SUPABASE_CONFIG=window.LIFELINE_SUPABASE||{}
const SUPABASE_URL=SUPABASE_CONFIG.url||'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_ANON_KEY=SUPABASE_CONFIG.anonKey||'YOUR_SUPABASE_ANON_KEY'
const CLOUD_TABLE='habit_data'
const LOCAL_STORAGE_KEY='habit-plus-v4'
const USER_LOCAL_STORAGE_PREFIX=`${LOCAL_STORAGE_KEY}:user:`

const today=new Date()
let currentMonth=today.getMonth()
let currentYear=today.getFullYear()
let selectedDay=null
let selectedKey=null
let contextRange=null
let contextEditable=null
let editingHabitIndex=null
let toastTimer=null
let cloudClient=null
let cloudUser=null
let cloudSaveTimer=null
let cloudReady=false
let cloudLoading=false
let farsiWordRefreshTimer=null
const baselineResetSpaceAt=new WeakMap()
const goalHitMemory=new Map()
const goalHitDelayUntil=new Map()
const goalHitDelayTimers=new Map()
let goalHitMemoryPrimed=false

let activeLocalStorageKey=LOCAL_STORAGE_KEY
let store=readLocalStore(activeLocalStorageKey)||{}

function readLocalStore(storageKey){
  try{
    const raw=localStorage.getItem(storageKey)
    if(!raw) return null
    const parsed=JSON.parse(raw)
    return parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:null
  }catch(error){
    console.error(`Could not read ${storageKey}:`,error)
    return null
  }
}

function userLocalStorageKey(user){
  return `${USER_LOCAL_STORAGE_PREFIX}${user.id}`
}

function escapeHtml(text){
  return String(text)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
}

function textToHtml(text){
  return escapeHtml(text).replace(/\n/g,'<br>')
}

function normalizeEditableHtml(el){
  const text=el.textContent.replace(/\u00a0/g,' ').trim()
  if(!text) return ''
  return el.innerHTML
}

function setEditableHtml(el,html){
  el.innerHTML=html||''
}

function clearEditableIfEmpty(el){
  if(el.textContent.replace(/\u00a0/g,' ').trim()==='') el.innerHTML=''
}

function placeCaretAtEnd(el){
  if(!el) return
  el.focus()
  const selection=window.getSelection()
  if(!selection) return
  const range=document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

function daysInMonth(m,y){return new Date(y,m+1,0).getDate()}
function key(){return currentYear+'-'+currentMonth}
function createEventItemId(){
  return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`
}
function getFarsiWordOfDay(date=new Date()){
  const index=(date.getFullYear()*372 + date.getMonth()*31 + date.getDate())%farsiWordsOfDay.length
  return farsiWordsOfDay[index]
}
function renderFarsiWordOfDay(){
  if(!farsiWordOfDay) return
  const word=getFarsiWordOfDay(new Date())
  farsiWordOfDay.innerHTML=`<span class="farsi-word-line"><span class="farsi-word">${word.fa}</span><span class="farsi-pronunciation">${word.pronunciation}</span><span class="farsi-separator">-</span><span class="farsi-translation">${word.en}</span></span>`
}
function scheduleFarsiWordRefresh(){
  if(farsiWordRefreshTimer) clearTimeout(farsiWordRefreshTimer)
  const now=new Date()
  const nextMidnight=new Date(now)
  nextMidnight.setHours(24,0,0,100)
  const delay=nextMidnight-now
  farsiWordRefreshTimer=setTimeout(()=>{
    renderFarsiWordOfDay()
    scheduleFarsiWordRefresh()
  },delay)
}
function getRandomHabitColor(){
  return HABIT_COLORS[Math.floor(Math.random()*HABIT_COLORS.length)].value
}
function normalizeColorHex(color){
  return typeof color==='string'?color.toLowerCase():''
}
function isValidHabitColor(color){
  const normalized=normalizeColorHex(color)
  return HABIT_COLORS.some(item=>item.value===normalized)||LEGACY_HABIT_COLORS.includes(normalized)
}
function normalizeHabitColor(color){
  const normalized=normalizeColorHex(color)
  return isValidHabitColor(normalized)?normalized:DEFAULT_HABIT_COLOR
}
function hexToRgb(hex){
  const normalized=normalizeColorHex(hex).replace('#','')
  if(!/^[0-9a-f]{6}$/.test(normalized)) return null
  return {
    r:parseInt(normalized.slice(0,2),16),
    g:parseInt(normalized.slice(2,4),16),
    b:parseInt(normalized.slice(4,6),16)
  }
}
function rgbToHex({r,g,b}){
  const clamp=value=>Math.max(0,Math.min(255,Math.round(value)))
  const toHex=value=>clamp(value).toString(16).padStart(2,'0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
function adjustHexColor(hex,delta){
  const rgb=hexToRgb(hex)
  if(!rgb) return '#6b8db8'
  return rgbToHex({
    r:rgb.r+delta,
    g:rgb.g+Math.round(delta*.82),
    b:rgb.b+Math.round(delta*1.08)
  })
}
function habitRowTint(hex){
  const rgb=hexToRgb(hex)
  if(!rgb) return '#f8f8f4'
  const paper={r:248,g:248,b:244}
  const blend=.34
  return rgbToHex({
    r:paper.r*(1-blend)+rgb.r*blend,
    g:paper.g*(1-blend)+rgb.g*blend,
    b:paper.b*(1-blend)+rgb.b*blend
  })
}
function habitCellTint(hex){
  const rgb=hexToRgb(hex)
  if(!rgb) return '#f8f8f4'
  const paper={r:248,g:248,b:244}
  const blend=.16
  return rgbToHex({
    r:paper.r*(1-blend)+rgb.r*blend,
    g:paper.g*(1-blend)+rgb.g*blend,
    b:paper.b*(1-blend)+rgb.b*blend
  })
}
function habitCheckboxTint(hex){
  const rgb=hexToRgb(hex)
  if(!rgb) return '#f4f4f1'
  const paper={r:248,g:248,b:244}
  const blend=.24
  return rgbToHex({
    r:paper.r*(1-blend)+rgb.r*blend,
    g:paper.g*(1-blend)+rgb.g*blend,
    b:paper.b*(1-blend)+rgb.b*blend
  })
}
function updateHabitColorPreview(){
  const color=normalizeHabitColor(habitColorSelect.value)
  habitColorPreview.style.backgroundColor=color
  habitColorSelect.style.color=color
  habitColorSelect.style.fontWeight='700'
}
function initHabitColorSelect(){
  if(!habitColorSelect) return
  habitColorSelect.innerHTML=''
  HABIT_COLORS.forEach(color=>{
    const option=document.createElement('option')
    option.value=color.value
    option.textContent=color.dot
    option.style.color=color.value
    option.style.fontWeight='700'
    habitColorSelect.appendChild(option)
  })
  habitColorSelect.value=getRandomHabitColor()
  updateHabitColorPreview()
}
function checkValue(state){
  if(state===true) return 1
  if(state==='yellow') return 0
  return 0
}
function isCheckedState(state){
  return state===true||state==='yellow'
}
function formatProgress(value){
  return Number.isInteger(value)?String(value):value.toFixed(1)
}
function getHabitStatus({goalHit,remainingDays,remainingNeeded,canStillHitGoal,deficitDays,paceDelta,projectedTotal,goalValue}){
  if(goalHit||(canStillHitGoal&&(paceDelta>=1||projectedTotal>=goalValue+1))){
    return {emoji:'🔥',className:'pct-good',label:'ahead'}
  }
  if(canStillHitGoal){
    return {emoji:'🙂',className:'pct-good',label:'on track'}
  }
  if(deficitDays<=3){
    return {emoji:'🙂',className:'pct-warn',label:'behind'}
  }
  return {emoji:'😢',className:'pct-bad',label:'really behind'}
}
function triggerGoalCelebration(rowEl){
  if(!rowEl) return
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const colors=['#f6bf26','#ffd86f','#f28b82','#7986cb','#33b679','#039be5']
  const count=reducedMotion?34:120

  for(let i=0;i<count;i++){
    const piece=document.createElement('span')
    piece.className='confetti-piece'
    const startX=Math.random()*window.innerWidth
    const drift=(Math.random()*200)-100
    const rot=`${Math.floor(Math.random()*820-410)}deg`
    const dur=`${Math.round(1800+Math.random()*1800)}ms`
    const delay=`${Math.round(Math.random()*420)}ms`
    piece.style.left=`${startX}px`
    piece.style.top='-20px'
    piece.style.setProperty('--drift',`${drift}px`)
    piece.style.setProperty('--rot',rot)
    piece.style.setProperty('--dur',dur)
    piece.style.setProperty('--delay',delay)
    piece.style.setProperty('--confetti',colors[i%colors.length])
    document.body.appendChild(piece)
    setTimeout(()=>piece.remove(),5000)
  }

  const trophy=document.createElement('div')
  trophy.className='trophy-pop'
  trophy.textContent='🏆'
  document.body.appendChild(trophy)
  setTimeout(()=>trophy.remove(),3800)
}
function triggerHabitTickPop(rowEl,emoji){
  if(!rowEl) return
  const icon=String(emoji||'').trim()||'✅'
  const iconCell=rowEl.querySelector('td.icon-col')
  const anchor=iconCell||rowEl
  const rect=anchor.getBoundingClientRect()
  const pop=document.createElement('div')
  pop.className='habit-tick-pop'
  pop.textContent=icon
  pop.style.left=`${rect.left+rect.width/2}px`
  pop.style.top=`${rect.top+rect.height/2}px`
  pop.style.setProperty('--pop-tilt',`${Math.round((Math.random()*14)-7)}deg`)
  document.body.appendChild(pop)
  setTimeout(()=>pop.remove(),820)
}
function initSelectors(){
  months.forEach((m,i)=>{
    const o=document.createElement('option')
    o.value=i;o.text=m;monthSelect.appendChild(o)
  })
  for(let y=2024;y<=2030;y++){
    const o=document.createElement('option')
    o.value=y;o.text=y;yearSelect.appendChild(o)
  }
  monthSelect.value=currentMonth
  yearSelect.value=currentYear
}

monthSelect.onchange=()=>{currentMonth=+monthSelect.value;render()}
yearSelect.onchange=()=>{currentYear=+yearSelect.value;render()}

function addHabit(name,icon,color=DEFAULT_HABIT_COLOR){
  if(!name) return
  store[key()]??={habits:[],events:[],daily:{}}
  store[key()].habits.push({
    name,icon,
    color:normalizeHabitColor(color),
    goal:daysInMonth(currentMonth,currentYear),
    checks:{}
  })
  save()
}

function editHabit(i){
  openHabitModal('edit',i)
}

function toggle(h,d,mode,{delayGoalChange=false}={}){
  const habit=store[key()].habits[h]
  const current=habit.checks[d]
  if(mode==='yellow'){
    habit.checks[d]=current==='yellow'?false:'yellow'
  }else{
    habit.checks[d]=current===true?false:true
  }
  if(delayGoalChange){
    const renderKey=`${key()}:${h}`
    const until=Date.now()+TOTAL_UPDATE_DELAY_MS
    goalHitDelayUntil.set(renderKey,until)
    const prevTimer=goalHitDelayTimers.get(renderKey)
    if(prevTimer) clearTimeout(prevTimer)
    const timer=setTimeout(()=>{
      goalHitDelayUntil.delete(renderKey)
      goalHitDelayTimers.delete(renderKey)
      render()
    },TOTAL_UPDATE_DELAY_MS+20)
    goalHitDelayTimers.set(renderKey,timer)
  }
  save()
}

function isSupabaseConfigured(){
  return SUPABASE_URL.includes('.supabase.co')
    && !SUPABASE_URL.includes('YOUR_PROJECT_ID')
    && SUPABASE_ANON_KEY
    && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY')
}

function setCloudStatus(message,state='idle'){
  if(!cloudStatus) return
  cloudStatus.textContent=message
  cloudStatus.dataset.state=state
}

function persistLocalStore(){
  localStorage.setItem(activeLocalStorageKey,JSON.stringify(store))
}

function markStoreUpdated(){
  store._updatedAt=new Date().toISOString()
}

function updateCloudControls(){
  if(!cloudLoginBtn||!cloudSignInBtn||!cloudLogoutBtn||!cloudEmail) return
  if(!isSupabaseConfigured()){
    cloudEmail.disabled=true
    cloudLoginBtn.disabled=true
    cloudSignInBtn.hidden=true
    cloudLogoutBtn.hidden=true
    setCloudStatus('Add Supabase keys','error')
    hideLoginOverlay()
    return
  }
  if(cloudUser){
    cloudEmail.hidden=true
    cloudLoginBtn.hidden=true
    cloudSignInBtn.hidden=true
    cloudLogoutBtn.hidden=false
    setCloudStatus(`Synced: ${cloudUser.email||'signed in'}`,'ok')
    hideLoginOverlay()
  }else{
    cloudEmail.hidden=false
    cloudLoginBtn.hidden=false
    cloudSignInBtn.hidden=false
    cloudLogoutBtn.hidden=true
    cloudEmail.disabled=false
    cloudLoginBtn.disabled=false
    setCloudStatus('Cloud sync available','idle')
    hideLoginOverlay()
  }
}

function showLoginOverlay(){
  if(!loginOverlay) return
  loginOverlay.style.display='flex'
  document.body.classList.add('locked')
}

function hideLoginOverlay(){
  if(!loginOverlay) return
  loginOverlay.style.display='none'
  document.body.classList.remove('locked')
}

function queueCloudSave(){
  if(!cloudReady||!cloudClient||!cloudUser||cloudLoading) return
  if(cloudSaveTimer) clearTimeout(cloudSaveTimer)
  setCloudStatus('Saving...','saving')
  cloudSaveTimer=setTimeout(saveCloudStore,900)
}

async function saveCloudStore(){
  if(!cloudClient||!cloudUser) return
  cloudSaveTimer=null
  try{
    const payload=JSON.parse(JSON.stringify(store))
    const {error}=await cloudClient
      .from(CLOUD_TABLE)
      .upsert({
        user_id:cloudUser.id,
        data:payload,
        updated_at:new Date().toISOString()
      },{onConflict:'user_id'})
    if(error) throw error
    setCloudStatus(`Synced: ${cloudUser.email||'signed in'}`,'ok')
  }catch(error){
    console.error('Cloud save failed:',error)
    setCloudStatus('Cloud save failed','error')
  }
}

function getStoreTimestamp(value){
  const parsed=Date.parse(value?._updatedAt||'')
  return Number.isFinite(parsed)?parsed:0
}

function hasVisibleStoreData(value){
  if(!value||typeof value!=='object'||Array.isArray(value)) return false
  return Object.keys(value).some(key=>key!=='_updatedAt')
}

async function loadCloudStore(){
  if(!cloudClient||!cloudUser) return
  const userStorageKey=userLocalStorageKey(cloudUser)
  const anonymousStore=readLocalStore(LOCAL_STORAGE_KEY)
  const userLocalStore=readLocalStore(userStorageKey)
  const hasUserLocal=hasVisibleStoreData(userLocalStore)
  activeLocalStorageKey=userStorageKey
  if(hasUserLocal){
    store=userLocalStore
  }else{
    store={}
  }
  goalHitMemory.clear()
  goalHitMemoryPrimed=false
  render()
  cloudLoading=true
  setCloudStatus('Loading cloud...','saving')
  try{
    const {data,error}=await cloudClient
      .from(CLOUD_TABLE)
      .select('data,updated_at')
      .eq('user_id',cloudUser.id)
      .maybeSingle()
    if(error) throw error

    if(data?.data&&typeof data.data==='object'){
      const remoteData=data.data
      const remoteTime=Math.max(Date.parse(data.updated_at||'')||0,getStoreTimestamp(remoteData))
      const localTime=hasUserLocal?getStoreTimestamp(userLocalStore):0
      if(hasUserLocal&&localTime>remoteTime){
        store=userLocalStore
        persistLocalStore()
        await saveCloudStore()
        showToast('Local changes uploaded to cloud.')
      }else{
        store=remoteData
        persistLocalStore()
        goalHitMemory.clear()
        goalHitMemoryPrimed=false
        render()
        showToast('Cloud data loaded.')
      }
    }else{
      store=hasUserLocal?userLocalStore:(hasVisibleStoreData(anonymousStore)?anonymousStore:{})
      persistLocalStore()
      await saveCloudStore()
      showToast('Journal cloud sync started.')
    }
    cloudReady=true
    updateCloudControls()
  }catch(error){
    console.error('Cloud load failed:',error)
    setCloudStatus('Cloud load failed','error')
  }finally{
    cloudLoading=false
  }
}

async function signInWithEmail(){
  if(!cloudClient||!cloudEmail||!cloudPassword||!cloudLoginBtn) return
  const email=cloudEmail.value.trim()
  const password=cloudPassword.value.trim()
  if(!email || !password){
    setLoginStatus('Enter your email and password.','error')
    showToast('Enter your email and password.')
    return
  }
  cloudLoginBtn.disabled=true
  setLoginStatus(isSignUp ? 'Signing up…' : 'Signing in…','saving')
  let result
  try{
    if(isSignUp){
      result = await cloudClient.auth.signUp({
        email,
        password
      })
    } else {
      result = await cloudClient.auth.signInWithPassword({
        email,
        password
      })
    }
  } catch (error) {
    console.error('Auth failed:',error)
    const friendlyMessage = getReadableAuthErrorMessage(error)
    setLoginStatus(friendlyMessage,'error')
    setCloudStatus(friendlyMessage,'error')
    showToast(friendlyMessage)
    cloudLoginBtn.disabled=false
    return
  }
  const {error} = result
  if(error){
    console.error('Auth failed:',error)
    const friendlyMessage = getReadableAuthErrorMessage(error)
    setLoginStatus(friendlyMessage,'error')
    setCloudStatus(friendlyMessage,'error')
    showToast(friendlyMessage)
    cloudLoginBtn.disabled=false
    return
  }
  if(isSignUp){
    setLoginStatus('Account created! Check your email to confirm.','ok')
    setCloudStatus('Check your email','ok')
    showToast('Account created! Check your email.')
  } else {
    setLoginStatus('Signed in successfully!','ok')
    setCloudStatus('Signed in','ok')
    showToast('Signed in!')
    hideLoginOverlay()
  }
  cloudLoginBtn.disabled=false
}

function toggleSignUpMode(event){
  event.preventDefault()
  isSignUp = !isSignUp
  const title = document.getElementById('loginOverlayTitle')
  const button = document.getElementById('cloudLoginBtn')
  const link = document.getElementById('signUpLink')
  if(isSignUp){
    title.textContent = 'Sign Up'
    button.textContent = 'Sign Up'
    link.textContent = 'Already have an account? Sign In'
  } else {
    title.textContent = 'Sign In'
    button.textContent = 'Sign In'
    link.textContent = 'Don\'t have an account? Sign Up'
  }
  setLoginStatus('')
}

function setLoginStatus(message,state='ok'){
  if(!loginStatus) return
  loginStatus.textContent=message
  loginStatus.classList.toggle('error',state==='error')
  loginStatus.classList.toggle('saving',state==='saving')
}

async function signOutCloud(){
  if(!cloudClient) return
  if(cloudSaveTimer){
    clearTimeout(cloudSaveTimer)
    await saveCloudStore()
  }
  await cloudClient.auth.signOut()
  cloudUser=null
  cloudReady=false
  activeLocalStorageKey=LOCAL_STORAGE_KEY
  store=readLocalStore(activeLocalStorageKey)||{}
  goalHitMemory.clear()
  goalHitMemoryPrimed=false
  updateCloudControls()
  render()
  showToast('Signed out. This browser keeps a local copy.')
}

async function initCloudSync(){
  if(!isSupabaseConfigured()){
    updateCloudControls()
    return
  }
  if(!window.supabase?.createClient){
    setCloudStatus('Supabase script blocked','error')
    hideLoginOverlay()
    return
  }
  cloudClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY)
  cloudLoginBtn?.addEventListener('click',signInWithEmail)
  cloudSignInBtn?.addEventListener('click',showLoginOverlay)
  cloudLogoutBtn?.addEventListener('click',signOutCloud)
  signUpLink?.addEventListener('click',toggleSignUpMode)
  cloudEmail?.addEventListener('keydown',event=>{
    if(event.key==='Enter') signInWithEmail()
  })
  cloudPassword?.addEventListener('keydown',event=>{
    if(event.key==='Enter') signInWithEmail()
  })
  const {data}=await cloudClient.auth.getSession()
  cloudUser=data.session?.user||null
  cloudClient.auth.onAuthStateChange((_event,session)=>{
    const nextUser=session?.user||null
    const changed=nextUser?.id!==cloudUser?.id
    cloudUser=nextUser
    cloudReady=Boolean(cloudUser)
    updateCloudControls()
    if(changed&&cloudUser) loadCloudStore()
    if(changed&&!cloudUser){
      activeLocalStorageKey=LOCAL_STORAGE_KEY
      store=readLocalStore(activeLocalStorageKey)||{}
      goalHitMemory.clear()
      goalHitMemoryPrimed=false
      render()
    }
  })
  updateCloudControls()
  if(cloudUser){
    loadCloudStore()
  }else{
    showLoginOverlay()
  }
}

function save(){
  markStoreUpdated()
  persistLocalStore()
  queueCloudSave()
  render()
}

function saveQuiet(){
  markStoreUpdated()
  persistLocalStore()
  queueCloudSave()
}

function formatBackupTimestamp(date){
  const pad=n=>String(n).padStart(2,'0')
  return `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
}

function backupFileName(date){
  return `${LOCAL_BACKUP_PREFIX}${formatBackupTimestamp(date)}.json`
}

function updateBackupButtonState(enabled){
  if(!backupBtn) return
  backupBtn.setAttribute('title','Download backup')
}

function showToast(message){
  if(!etherealToast) return
  etherealToast.textContent=message
  etherealToast.classList.remove('show')
  void etherealToast.offsetWidth
  etherealToast.classList.add('show')
  if(toastTimer) clearTimeout(toastTimer)
  toastTimer=setTimeout(()=>{
    etherealToast.classList.remove('show')
  },2100)
}

function resetTypingBaseline(editable){
  if(document.queryCommandState('superscript')){
    document.execCommand('superscript',false,null)
  }
  if(document.queryCommandState('subscript')){
    document.execCommand('subscript',false,null)
  }
  const selection=window.getSelection()
  if(!selection||!selection.rangeCount) return
  const range=selection.getRangeAt(0)
  if(!editable.contains(range.startContainer)) return
  let node=range.startContainer.nodeType===Node.ELEMENT_NODE?range.startContainer:range.startContainer.parentElement
  while(node&&node!==editable){
    if(node.style){
      if(node.style.verticalAlign) node.style.verticalAlign=''
      if(node.style.fontSize) node.style.fontSize=''
      if(!node.getAttribute('style')) node.removeAttribute('style')
    }
    node=node.parentElement
  }
}

function downloadLocalStorageBackup(){
  const raw=localStorage.getItem(activeLocalStorageKey)
  if(!raw){
    showToast('No local data found for the current session.')
    return false
  }
  try{
    JSON.parse(raw)
    const name=backupFileName(new Date())
    const blob=new Blob([raw],{type:'application/json'})
    const url=URL.createObjectURL(blob)
    const link=document.createElement('a')
    link.href=url
    link.download=name
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(()=>URL.revokeObjectURL(url),1000)
    return true
  }catch(err){
    console.error('Backup download failed:',err)
    showToast('Could not download backup because local data is not valid JSON.')
    return false
  }
}

async function chooseBackupFolder(){
  if(downloadLocalStorageBackup()){
    showToast('Computa, save my life')
  }
}

function triggerRestorePicker(){
  if(!restoreInput) return
  restoreInput.value=''
  restoreInput.click()
}

function importBackupText(rawText){
  let parsed
  try{
    parsed=JSON.parse(rawText)
  }catch(err){
    showToast('Invalid backup file (not valid JSON).')
    return false
  }
  if(!parsed||typeof parsed!=='object'||Array.isArray(parsed)){
    showToast('Invalid backup format.')
    return false
  }
  store=parsed
  markStoreUpdated()
  persistLocalStore()
  queueCloudSave()
  goalHitMemory.clear()
  goalHitMemoryPrimed=false
  render()
  showToast('Backup restored.')
  return true
}

function handleRestoreFileInput(e){
  const file=e?.target?.files?.[0]
  if(!file) return
  const reader=new FileReader()
  reader.onload=()=>{
    const text=typeof reader.result==='string'?reader.result:''
    importBackupText(text)
  }
  reader.onerror=()=>{
    showToast('Could not read backup file.')
  }
  reader.readAsText(file)
}

function getMonthData(){
  store[key()]??={habits:[],events:{},daily:{},monthly:{},tasks:{items:[]}}
  store[key()].daily??={}
  store[key()].events??={}
  store[key()].monthly??={goals:'',excited:'',insights:''}
  store[key()].tasks??={items:[]}
  return store[key()]
}

function getDaily(day){
  const monthData=getMonthData()
  const dayKey=String(day)
  let shouldPersist=false
  if(!monthData.daily[dayKey]){
    monthData.daily[dayKey]={
      mood:[],
      dream:'',
      journal:'',
      grateful:Array.from({length:5},()=> '')
    }
    shouldPersist=true
  }
  const daily=monthData.daily[dayKey]
  if(!daily._rich){
    daily.dream=textToHtml(daily.dream||'')
    daily.journal=textToHtml(daily.journal||'')
    daily.grateful=(daily.grateful||[]).map(item=>textToHtml(item||''))
    daily._rich=true
    shouldPersist=true
  }
  if(!Array.isArray(daily.mood)){
    daily.mood=daily.mood?[daily.mood]:[]
    shouldPersist=true
  }
  if(typeof daily.dream!=='string'){
    daily.dream=''
    shouldPersist=true
  }
  if(typeof daily.journal!=='string'){
    daily.journal=''
    shouldPersist=true
  }
  if(!Array.isArray(daily.grateful)){
    daily.grateful=[]
    shouldPersist=true
  }
  while(daily.grateful.length<5){
    daily.grateful.push('')
    shouldPersist=true
  }
  daily.grateful=daily.grateful.slice(0,5)
  if(daily.grateful.some(item=>typeof item!=='string')){
    daily.grateful=daily.grateful.map(item=>(typeof item==='string'?item:''))
    shouldPersist=true
  }
  if(shouldPersist) saveQuiet()
  return daily
}

function hasVisibleTodoText(html){
  const wrapper=document.createElement('div')
  wrapper.innerHTML=html||''
  return wrapper.textContent.replace(/\u00a0/g,' ').trim()!==''
}

function normalizeTaskRecord(task){
  if(!task||typeof task!=='object') return null
  const createdDay=Number.isInteger(task.createdDay)?task.createdDay:1
  const completedDay=Number.isInteger(task.completedDay)?task.completedDay:null
  const archivedDay=Number.isInteger(task.archivedDay)?task.archivedDay:null
  return {
    id:task.id||createEventItemId(),
    text:task._rich?String(task.text||''):textToHtml(task.text||''),
    createdDay,
    completedDay,
    archivedDay,
    _rich:true
  }
}

function getLegacyDailyItems(day){
  const items=getMonthData().daily?.[String(day)]?.items
  return Array.isArray(items)?items:[]
}

function getLegacyEventItems(day){
  const monthData=getMonthData()
  if(Array.isArray(monthData.events)){
    return day===1?monthData.events:[]
  }
  const items=monthData.events?.[String(day)]?.items
  return Array.isArray(items)?items:[]
}

function migrateLegacyTasksForMonth(taskStore){
  const maxDays=daysInMonth(currentMonth,currentYear)
  const legacySourceToTaskId=new Map()
  const registerLegacyItem=(item,day)=>{
    if(!item) return
    const html=item._rich?String(item.text||''):textToHtml(item.text||'')
    if(!hasVisibleTodoText(html)) return
    const lineageIds=[item.id,item._carriedFromItemId,item._migratedFromEventId].filter(Boolean)
    let task=null
    for(const lineageId of lineageIds){
      const existingTaskId=legacySourceToTaskId.get(lineageId)
      if(!existingTaskId) continue
      task=taskStore.items.find(entry=>entry.id===existingTaskId)||null
      if(task) break
    }
    if(!task){
      task={
        id:createEventItemId(),
        text:html,
        createdDay:day,
        completedDay:null,
        archivedDay:null,
        _rich:true
      }
      taskStore.items.push(task)
    }
    task.text=html
    task.createdDay=Math.min(task.createdDay,day)
    if(item.done){
      task.completedDay=task.completedDay===null?day:Math.min(task.completedDay,day)
    }
    lineageIds.forEach(lineageId=>legacySourceToTaskId.set(lineageId,task.id))
  }

  for(let day=1;day<=maxDays;day++){
    getLegacyEventItems(day).forEach(item=>registerLegacyItem(item,day))
    getLegacyDailyItems(day).forEach(item=>registerLegacyItem(item,day))
  }
}

function getTaskStore(){
  const monthData=getMonthData()
  monthData.tasks??={items:[]}
  let shouldPersist=false
  if(!Array.isArray(monthData.tasks.items)){
    monthData.tasks.items=[]
    shouldPersist=true
  }
  monthData.tasks.items=monthData.tasks.items
    .map(normalizeTaskRecord)
    .filter(Boolean)
  if(!monthData.tasks._migratedFromLegacy){
    migrateLegacyTasksForMonth(monthData.tasks)
    monthData.tasks._migratedFromLegacy=true
    shouldPersist=true
  }
  if(shouldPersist) saveQuiet()
  return monthData.tasks
}

function isCurrentMonthView(){
  return currentYear===today.getFullYear()&&currentMonth===today.getMonth()
}

function isFutureDayInCurrentMonth(day){
  return isCurrentMonthView()&&day>today.getDate()
}

function getRealizedDayLimit(){
  return isCurrentMonthView()?today.getDate():daysInMonth(currentMonth,currentYear)
}

function taskIsCompletedOnDay(task,day){
  return task.completedDay===day
}

function taskIsVisibleOnDay(task,day){
  if(task.archivedDay!==null&&task.archivedDay<=day) return false
  if(isFutureDayInCurrentMonth(day)){
    return task.createdDay===day||task.completedDay===day
  }
  if(task.createdDay>day) return false
  if(task.completedDay!==null&&task.completedDay<day) return false
  return true
}

function taskContinuesPastDay(task,day){
  const realizedLimit=getRealizedDayLimit()
  if(day>=realizedLimit) return false
  return task.completedDay===null||task.completedDay>day
}

function compareTaskEntries(a,b){
  if(a.isDone!==b.isDone) return a.isDone?1:-1
  if(a.isCarried!==b.isCarried) return a.isCarried?-1:1
  if(a.task.createdDay!==b.task.createdDay) return a.task.createdDay-b.task.createdDay
  return a.task.id.localeCompare(b.task.id)
}

function getTaskEntriesForDay(day){
  const tasks=getTaskStore().items.filter(task=>taskIsVisibleOnDay(task,day))
  const entries=tasks.map(task=>({
    task,
    isDone:taskIsCompletedOnDay(task,day),
    isCarried:task.createdDay<day&&!isFutureDayInCurrentMonth(day),
    showCarrySource:taskContinuesPastDay(task,day)
  }))
  const activeEntries=entries.filter(entry=>!entry.isDone).sort(compareTaskEntries)
  const doneEntries=entries.filter(entry=>entry.isDone).sort(compareTaskEntries)
  return {activeEntries,doneEntries,visibleTaskCount:entries.length}
}

function createTaskForDay(day,html=''){
  const task=normalizeTaskRecord({
    id:createEventItemId(),
    text:html,
    createdDay:day,
    completedDay:null,
    archivedDay:null,
    _rich:true
  })
  getTaskStore().items.push(task)
  return task
}

function deleteTask(taskId){
  const taskStore=getTaskStore()
  const nextItems=taskStore.items.filter(task=>task.id!==taskId)
  taskStore.items=nextItems
}

function updateTaskText(taskId,html){
  const task=getTaskStore().items.find(entry=>entry.id===taskId)
  if(!task) return
  task.text=html
  task._rich=true
}

function setTaskCompletedForDay(taskId,day,isDone){
  const task=getTaskStore().items.find(entry=>entry.id===taskId)
  if(!task) return
  task.completedDay=isDone?day:null
}

function openDreamModal(){
  if(selectedDay===null) return
  const daily=getDaily(selectedDay)
  dreamTitle.textContent=`Dreams • ${formatDayLabel(selectedDay)}`
  setEditableHtml(dreamText,daily.dream||'')
  dreamModal.classList.add('show')
  dreamModal.setAttribute('aria-hidden','false')
  dreamText.focus()
}

function closeDreamModal(){
  dreamModal.classList.remove('show')
  dreamModal.setAttribute('aria-hidden','true')
}

function openHabitModal(mode='add',index=null){
  habitModal.classList.add('show')
  habitModal.setAttribute('aria-hidden','false')
  if(mode==='edit'){
    editingHabitIndex=index
    const h=store[key()].habits[index]
    habitTitle.textContent='Edit Habit'
    habitSave.textContent='Save'
    habitDelete.style.display='inline-flex'
    habitNameInput.value=h?.name||''
    habitIconInput.value=h?.icon||''
    habitColorSelect.value=normalizeHabitColor(h?.color)
  }else{
    editingHabitIndex=null
    habitTitle.textContent='Add Habit'
    habitSave.textContent='Add'
    habitDelete.style.display='none'
    habitNameInput.value=''
    habitIconInput.value=''
    habitColorSelect.value=getRandomHabitColor()
  }
  updateHabitColorPreview()
  habitNameInput.focus()
}

function closeHabitModal(){
  habitModal.classList.remove('show')
  habitModal.setAttribute('aria-hidden','true')
  editingHabitIndex=null
}

function openJournalModal(){
  if(selectedDay===null) return
  const daily=getDaily(selectedDay)
  journalTitle.textContent=`Journal • ${formatDayLabel(selectedDay)}`
  setEditableHtml(journalText,daily.journal||'')
  journalModal.classList.add('show')
  journalModal.setAttribute('aria-hidden','false')
  journalText.focus()
}

function closeJournalModal(){
  journalModal.classList.remove('show')
  journalModal.setAttribute('aria-hidden','true')
}

function openGratefulModal(){
  if(selectedDay===null) return
  const daily=getDaily(selectedDay)
  gratefulTitle.textContent=`Grateful • ${formatDayLabel(selectedDay)}`
  gratefulInputs.forEach((input,i)=>{
    setEditableHtml(input,daily.grateful?.[i]||'')
  })
  gratefulModal.classList.add('show')
  gratefulModal.setAttribute('aria-hidden','false')
  if(gratefulInputs[0]) gratefulInputs[0].focus()
}

function closeGratefulModal(){
  gratefulModal.classList.remove('show')
  gratefulModal.setAttribute('aria-hidden','true')
}

function openSimpleTodoModal(){
  simpleTodoModal.classList.add('show')
  simpleTodoModal.setAttribute('aria-hidden','false')
  simpleTodoClose.focus()
}

function closeSimpleTodoModal(){
  simpleTodoModal.classList.remove('show')
  simpleTodoModal.setAttribute('aria-hidden','true')
}

function renderDailyList(day,container,{animate=false}={}){
  const {activeEntries,doneEntries,visibleTaskCount}=getTaskEntriesForDay(day)
  const visibleRows=Math.min(
    DAILY_LINES,
    Math.max(
      DEFAULT_VISIBLE_DAILY_LINES,
      visibleTaskCount+(visibleTaskCount<DAILY_LINES?1:0)
    )
  )
  const previousPositions=new Map()
  if(animate){
    Array.from(container.children).forEach(child=>{
      const id=child.dataset.todoItemId
      if(!id) return
      previousPositions.set(id,child.getBoundingClientRect().top)
    })
  }
  container.innerHTML=''
  const renderTaskRow=(entry,isDone)=>{
    const {task,isCarried,showCarrySource}=entry
    const line=document.createElement('div')
    line.dataset.todoItemId=task.id
    line.className='todo-line'+(showCarrySource?' carried-previous':'')
    const check=document.createElement('button')
    check.type='button'
    check.className='todo-check'+(isDone?' checked':'')
    check.addEventListener('click',()=>{
      setTaskCompletedForDay(task.id,day,!isDone)
      saveQuiet()
      renderDailyList(day,container,{animate:true})
    })
    const input=document.createElement('div')
    input.className='todo-input'
    input.setAttribute('contenteditable','true')
    input.dataset.placeholder='Write a task...'
    if(isCarried){
      input.title=`Carried from ${formatDayLabel(task.createdDay)}`
    }
    setEditableHtml(input,task.text)
    input.addEventListener('input',e=>{
      const html=normalizeEditableHtml(e.target)
      const isVisible=hasVisibleTodoText(html)
      if(!isVisible){
        deleteTask(task.id)
        saveQuiet()
        renderDailyList(day,container)
        return
      }
      updateTaskText(task.id,html)
      saveQuiet()
    })
    input.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
    line.appendChild(check)
    line.appendChild(input)
    container.appendChild(line)
  }

  activeEntries.forEach(entry=>renderTaskRow(entry,false))
  doneEntries.forEach(entry=>renderTaskRow(entry,true))

  const blankRows=Math.max(0,visibleRows-(activeEntries.length+doneEntries.length))
  for(let i=0;i<blankRows;i++){
    const line=document.createElement('div')
    line.className='todo-line'
    const check=document.createElement('button')
    check.type='button'
    check.className='todo-check'
    const input=document.createElement('div')
    input.className='todo-input'
    input.setAttribute('contenteditable','true')
    input.dataset.placeholder='Write a task...'
    check.addEventListener('click',()=>placeCaretAtEnd(input))
    input.addEventListener('input',e=>{
      const html=normalizeEditableHtml(e.target)
      if(!hasVisibleTodoText(html)) return
      const task=createTaskForDay(day,html)
      saveQuiet()
      renderDailyList(day,container)
      const refreshedInput=container.querySelector(`[data-todo-item-id="${task.id}"] .todo-input`)
      placeCaretAtEnd(refreshedInput)
    })
    input.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
    line.appendChild(check)
    line.appendChild(input)
    container.appendChild(line)
  }
  if(animate){
    Array.from(container.children).forEach(child=>{
      const id=child.dataset.todoItemId
      const oldTop=previousPositions.get(id)
      if(oldTop===undefined) return
      const newTop=child.getBoundingClientRect().top
      const delta=oldTop-newTop
      if(Math.abs(delta)<1) return
      child.animate(
        [
          {transform:`translateY(${delta}px)`},
          {transform:'translateY(0px)'}
        ],
        {duration:240,easing:'ease'}
      )
    })
  }
}

function renderMood(day,container){
  const daily=getDaily(day)
  container.innerHTML=''
  MOODS.forEach(emoji=>{
    const btn=document.createElement('button')
    btn.type='button'
    const isSelected=daily.mood.includes(emoji)
    btn.className='mood-btn'+(isSelected?' selected':'')
    btn.textContent=emoji
    btn.addEventListener('click',()=>{
      if(daily.mood.includes(emoji)){
        daily.mood=daily.mood.filter(e=>e!==emoji)
      }else{
        daily.mood=[...daily.mood,emoji]
      }
      saveQuiet()
      renderMood(day,container)
    })
    container.appendChild(btn)
  })
}

function getEvents(day){
  store[key()].events??={}
  if(Array.isArray(store[key()].events)){
    const legacy=store[key()].events
    store[key()].events={}
    store[key()].events[String(day)]={items:legacy}
  }
  const dayKey=String(day)
  if(!store[key()].events[dayKey]){
    store[key()].events[dayKey]={items:Array.from({length:EVENTS_LINES},()=>({id:createEventItemId(),text:'',done:false}))}
  }
  const items=store[key()].events[dayKey].items
  while(items.length<EVENTS_LINES){
    items.push({id:createEventItemId(),text:'',done:false})
  }
  if(!store[key()].events[dayKey]._rich){
    items.forEach(item=>{
      if(!item.id) item.id=createEventItemId()
      if(!item._rich){
        item.text=textToHtml(item.text||'')
        item._rich=true
      }
      if(typeof item.carriedForwardTo!=='number') item.carriedForwardTo=null
      if(typeof item.carriedFromDay!=='number') item.carriedFromDay=null
    })
    store[key()].events[dayKey]._rich=true
  }
  return store[key()].events[dayKey]
}

function ensureLegacyEventCarryThrough(day){
  if(day<=1) return
  for(let d=1;d<=day;d++){
    const events=getEvents(d)
    if(events._carryInitialized) continue
    if(d>1){
      carryForwardEvents(d)
    }
    events._carryInitialized=true
  }
}

function hasVisibleEventText(html){
  const wrapper=document.createElement('div')
  wrapper.innerHTML=html||''
  return wrapper.textContent.replace(/\u00a0/g,' ').trim()!==''
}

function carryForwardEvents(day){
  if(day<=1) return
  const eventsStore=store[key()].events
  const current=eventsStore[String(day)]
  if(!current||!Array.isArray(current.items)) return
  const previous=getEvents(day-1)
  if(!previous||!Array.isArray(previous.items)) return

  previous.items.forEach(prevItem=>{
    if(!prevItem||prevItem.done||!hasVisibleEventText(prevItem.text)) return
    if(typeof prevItem.carriedForwardTo==='number'&&prevItem.carriedForwardTo>=day) return
    const emptySlot=current.items.find(item=>!item.done&&!hasVisibleEventText(item.text))
    if(!emptySlot) return
    emptySlot.text=prevItem.text
    emptySlot.done=false
    emptySlot._rich=true
    emptySlot.carriedFromDay=day-1
    emptySlot.carriedForwardTo=null
    prevItem.carriedForwardTo=day
  })
}

function reorderEventItems(day){
  const events=getEvents(day)
  const undone=events.items.filter(item=>!item.done)
  const done=events.items.filter(item=>item.done)
  events.items=[...undone,...done]
}

function renderEventsList(day,container,{animate=false}={}){
  const events=getEvents(day)
  const previousPositions=new Map()
  if(animate){
    Array.from(container.children).forEach(child=>{
      const id=child.dataset.eventItemId
      if(!id) return
      previousPositions.set(id,child.getBoundingClientRect().top)
    })
  }
  container.innerHTML=''
  events.items.slice(0,EVENTS_LINES).forEach(item=>{
    const line=document.createElement('div')
    line.dataset.eventItemId=item.id
    line.className='todo-line'+(item.carriedForwardTo?' carried-previous':'')
    const check=document.createElement('button')
    check.type='button'
    check.className='todo-check'+(item.done?' checked':'')
    check.addEventListener('click',()=>{
      item.done=!item.done
      reorderEventItems(day)
      saveQuiet()
      renderEventsList(day,container,{animate:true})
    })
    const input=document.createElement('div')
    input.className='todo-input'
    input.setAttribute('contenteditable','true')
    input.dataset.placeholder='Event...'
    if(item.carriedFromDay){
      input.title=`Carried from ${formatDayLabel(item.carriedFromDay)}`
    }
    setEditableHtml(input,item.text)
    input.addEventListener('input',e=>{
      item.text=normalizeEditableHtml(e.target)
      item._rich=true
      saveQuiet()
    })
    input.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
    line.appendChild(check)
    line.appendChild(input)
    container.appendChild(line)
  })
  if(animate){
    Array.from(container.children).forEach(child=>{
      const id=child.dataset.eventItemId
      const oldTop=previousPositions.get(id)
      if(oldTop===undefined) return
      const newTop=child.getBoundingClientRect().top
      const delta=oldTop-newTop
      if(Math.abs(delta)<1) return
      child.animate(
        [
          {transform:`translateY(${delta}px)`},
          {transform:'translateY(0px)'}
        ],
        {
          duration:240,
          easing:'ease'
        }
      )
    })
  }
}

function currentMonthStorageKey(){
  return `${today.getFullYear()}-${today.getMonth()}`
}

function compareMonthKeys(a,b){
  const [ay,am]=String(a).split('-').map(Number)
  const [by,bm]=String(b).split('-').map(Number)
  if(ay!==by) return ay-by
  return am-bm
}

function formatMonthTaskLabel(monthKey){
  const [year,month]=String(monthKey).split('-').map(Number)
  return new Date(year,month,1).toLocaleDateString('en-US',{month:'long',year:'numeric'})
}

function isFutureMonthKey(monthKey){
  return compareMonthKeys(monthKey,currentMonthStorageKey())>0
}

function normalizeMonthlyChecklistTask(task,fallbackMonthKey){
  if(!task||typeof task!=='object') return null
  return {
    id:task.id||createEventItemId(),
    text:task._rich?String(task.text||''):textToHtml(task.text||''),
    createdMonthKey:typeof task.createdMonthKey==='string'?task.createdMonthKey:fallbackMonthKey,
    completedMonthKey:typeof task.completedMonthKey==='string'?task.completedMonthKey:null,
    archivedMonthKey:typeof task.archivedMonthKey==='string'?task.archivedMonthKey:null,
    _rich:true
  }
}

function listStoredMonthKeys(){
  return Object.keys(store).filter(monthKey=>/^\d{4}-\d+$/.test(monthKey)).sort(compareMonthKeys)
}

function getMonthlyChecklistTaskBuckets(){
  store._monthChecklistTasks??={}
  store._monthChecklistTasks.monthlyTodo??={items:[]}
  return store._monthChecklistTasks
}

function extractChecklistSeedLines(html,limit){
  return String(html||'')
    .replace(/<br\s*\/?>/gi,'\n')
    .replace(/<[^>]+>/g,'')
    .split('\n')
    .map(line=>line.trim())
    .filter(Boolean)
    .slice(0,limit)
}

function migrateLegacyMonthlyChecklistCategory(bucketName,{getItems,getSeedLines}){
  const buckets=getMonthlyChecklistTaskBuckets()
  const bucket=buckets[bucketName]
  if(bucket._migratedFromLegacy) return bucket
  bucket.items=Array.isArray(bucket.items)?bucket.items:[]
  listStoredMonthKeys().forEach(monthKey=>{
    const monthData=store[monthKey]
    const sourceItems=getItems(monthData)||[]
    if(sourceItems.length){
      sourceItems.forEach(item=>{
        const normalized=normalizeMonthlyChecklistTask({
          id:item?.id,
          text:item?.text,
          createdMonthKey:monthKey,
          completedMonthKey:item?.done?monthKey:null,
          archivedMonthKey:null,
          _rich:item?._rich
        },monthKey)
        if(normalized&&hasVisibleTodoText(normalized.text)){
          bucket.items.push(normalized)
        }
      })
      return
    }
    const seedLines=getSeedLines?getSeedLines(monthData):[]
    seedLines.forEach(text=>{
      bucket.items.push(normalizeMonthlyChecklistTask({
        text,
        createdMonthKey:monthKey,
        completedMonthKey:null,
        archivedMonthKey:null,
        _rich:true
      },monthKey))
    })
  })
  bucket._migratedFromLegacy=true
  saveQuiet()
  return bucket
}

function getMonthlyChecklistBucket(bucketName){
  switch(bucketName){
    case 'monthlyTodo':
      return migrateLegacyMonthlyChecklistCategory(bucketName,{
        getItems:monthData=>monthData?.monthly?.todo?.items,
        getSeedLines:monthData=>extractChecklistSeedLines(monthData?.monthly?.insights,MONTHLY_TODO_DEFAULT_LINES)
      })
    default:
      return migrateLegacyMonthlyChecklistCategory(bucketName,{getItems:()=>[]})
  }
}

function taskCompletedInMonth(task,monthKey){
  return task.completedMonthKey===monthKey
}

function taskVisibleInMonth(task,monthKey){
  if(task.archivedMonthKey&&compareMonthKeys(task.archivedMonthKey,monthKey)<=0) return false
  if(isFutureMonthKey(monthKey)){
    return task.createdMonthKey===monthKey||task.completedMonthKey===monthKey
  }
  if(compareMonthKeys(task.createdMonthKey,monthKey)>0) return false
  if(task.completedMonthKey&&compareMonthKeys(task.completedMonthKey,monthKey)<0) return false
  return true
}

function taskCarriesPastMonth(task,monthKey){
  if(compareMonthKeys(monthKey,currentMonthStorageKey())>=0) return false
  return task.completedMonthKey===null||compareMonthKeys(task.completedMonthKey,monthKey)>0
}

function compareMonthlyChecklistEntries(a,b){
  if(a.isDone!==b.isDone) return a.isDone?1:-1
  if(a.isCarried!==b.isCarried) return a.isCarried?-1:1
  if(a.task.createdMonthKey!==b.task.createdMonthKey){
    return compareMonthKeys(a.task.createdMonthKey,b.task.createdMonthKey)
  }
  return a.task.id.localeCompare(b.task.id)
}

function getMonthlyChecklistEntries(bucketName,monthKey){
  const tasks=getMonthlyChecklistBucket(bucketName).items
    .map(task=>normalizeMonthlyChecklistTask(task,monthKey))
    .filter(task=>task&&hasVisibleTodoText(task.text)&&taskVisibleInMonth(task,monthKey))
  const entries=tasks.map(task=>({
    task,
    isDone:taskCompletedInMonth(task,monthKey),
    isCarried:compareMonthKeys(task.createdMonthKey,monthKey)<0&&!isFutureMonthKey(monthKey),
    showCarrySource:taskCarriesPastMonth(task,monthKey)
  }))
  const activeEntries=entries.filter(entry=>!entry.isDone).sort(compareMonthlyChecklistEntries)
  const doneEntries=entries.filter(entry=>entry.isDone).sort(compareMonthlyChecklistEntries)
  return {activeEntries,doneEntries,visibleTaskCount:entries.length}
}

function createMonthlyChecklistTask(bucketName,monthKey,html){
  const bucket=getMonthlyChecklistBucket(bucketName)
  const task=normalizeMonthlyChecklistTask({
    id:createEventItemId(),
    text:html,
    createdMonthKey:monthKey,
    completedMonthKey:null,
    archivedMonthKey:null,
    _rich:true
  },monthKey)
  bucket.items.push(task)
  return task
}

function updateMonthlyChecklistTaskText(bucketName,taskId,html){
  const task=getMonthlyChecklistBucket(bucketName).items.find(entry=>entry.id===taskId)
  if(!task) return
  task.text=html
  task._rich=true
}

function deleteMonthlyChecklistTask(bucketName,taskId){
  const bucket=getMonthlyChecklistBucket(bucketName)
  bucket.items=bucket.items.filter(task=>task.id!==taskId)
}

function setMonthlyChecklistTaskCompleted(bucketName,taskId,monthKey,isDone){
  const task=getMonthlyChecklistBucket(bucketName).items.find(entry=>entry.id===taskId)
  if(!task) return
  task.completedMonthKey=isDone?monthKey:null
}

function renderMonthlyChecklistLikeDaily(container,{bucketName,placeholder,minRows}){
  const monthKey=key()
  const {activeEntries,doneEntries,visibleTaskCount}=getMonthlyChecklistEntries(bucketName,monthKey)
  const visibleRows=Math.max(minRows,visibleTaskCount+1)
  container.innerHTML=''
  const renderTaskRow=(entry,isDone)=>{
    const {task,isCarried,showCarrySource}=entry
    const line=document.createElement('div')
    line.dataset.todoItemId=task.id
    line.className='todo-line'+(showCarrySource?' carried-previous':'')+(isDone?' done':'')
    const check=document.createElement('button')
    check.type='button'
    check.className='todo-check'+(isDone?' checked':'')
    check.addEventListener('click',()=>{
      setMonthlyChecklistTaskCompleted(bucketName,task.id,monthKey,!isDone)
      saveQuiet()
      renderMonthlyChecklistLikeDaily(container,{bucketName,placeholder,minRows})
    })
    const input=document.createElement('div')
    input.className='todo-input'
    input.setAttribute('contenteditable','true')
    input.dataset.placeholder=placeholder
    if(isCarried){
      input.title=`Carried from ${formatMonthTaskLabel(task.createdMonthKey)}`
    }
    setEditableHtml(input,task.text)
    input.addEventListener('input',e=>{
      const html=normalizeEditableHtml(e.target)
      if(!hasVisibleTodoText(html)){
        deleteMonthlyChecklistTask(bucketName,task.id)
        saveQuiet()
        renderMonthlyChecklistLikeDaily(container,{bucketName,placeholder,minRows})
        return
      }
      updateMonthlyChecklistTaskText(bucketName,task.id,html)
      saveQuiet()
    })
    input.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
    line.appendChild(check)
    line.appendChild(input)
    container.appendChild(line)
  }

  activeEntries.forEach(entry=>renderTaskRow(entry,false))
  doneEntries.forEach(entry=>renderTaskRow(entry,true))

  const blankRows=Math.max(0,visibleRows-(activeEntries.length+doneEntries.length))
  for(let i=0;i<blankRows;i++){
    const line=document.createElement('div')
    line.className='todo-line'
    const check=document.createElement('button')
    check.type='button'
    check.className='todo-check'
    const input=document.createElement('div')
    input.className='todo-input'
    input.setAttribute('contenteditable','true')
    input.dataset.placeholder=placeholder
    check.addEventListener('click',()=>placeCaretAtEnd(input))
    input.addEventListener('input',e=>{
      const html=normalizeEditableHtml(e.target)
      if(!hasVisibleTodoText(html)) return
      const task=createMonthlyChecklistTask(bucketName,monthKey,html)
      saveQuiet()
      renderMonthlyChecklistLikeDaily(container,{bucketName,placeholder,minRows})
      const refreshedInput=container.querySelector(`[data-todo-item-id="${task.id}"] .todo-input`)
      placeCaretAtEnd(refreshedInput)
    })
    input.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
    line.appendChild(check)
    line.appendChild(input)
    container.appendChild(line)
  }
}

function setSelectedDay(day,days){
  const maxDays=days||daysInMonth(currentMonth,currentYear)
  if(day<1) day=1
  if(day>maxDays) day=maxDays
  selectedDay=day
  getTaskStore()
  todayHeading.textContent=formatDayLabel(selectedDay)
  renderDailyList(selectedDay,dailyList)
  renderMood(selectedDay,dailyMood)
}

function formatDayLabel(day){
  const date=new Date(currentYear,currentMonth,day)
  const weekday=date.toLocaleDateString('en-US',{weekday:'long'})
  const suffix=getOrdinalSuffix(day)
  return `${weekday}, ${day}${suffix}`
}

function getOrdinalSuffix(n){
  const mod100=n%100
  if(mod100>=11&&mod100<=13) return 'th'
  switch(n%10){
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

function getOffDaySet(totalDays){
  const monthData=store[key()]||{}
  const raw=monthData.offDays
  const offDays=new Set()
  if(!raw||typeof raw!=='object'||Array.isArray(raw)) return offDays
  Object.entries(raw).forEach(([day,isOff])=>{
    const parsedDay=Number(day)
    if(isOff&&Number.isInteger(parsedDay)&&parsedDay>=1&&parsedDay<=totalDays){
      offDays.add(parsedDay)
    }
  })
  return offDays
}

function setOffDay(day,isOff){
  store[key()]??={habits:[],events:{},daily:{},monthly:{}}
  if(!store[key()].offDays||typeof store[key()].offDays!=='object'||Array.isArray(store[key()].offDays)){
    store[key()].offDays={}
  }
  if(isOff){
    store[key()].offDays[String(day)]=true
  }else{
    delete store[key()].offDays[String(day)]
  }
}

function toggleOffDay(day,totalDays){
  const offDays=getOffDaySet(totalDays)
  if(offDays.has(day)){
    setOffDay(day,false)
    save()
    return
  }
  if(offDays.size>=MAX_OFF_DAYS_PER_MONTH){
    showToast(`Only ${MAX_OFF_DAYS_PER_MONTH} off days per month.`)
    return
  }
  setOffDay(day,true)
  const remaining=MAX_OFF_DAYS_PER_MONTH-(offDays.size+1)
  showToast(`Off day saved. ${remaining} left this month.`)
  save()
}

function getElapsedTrackableDays(totalDays,offDays){
  const viewedMonthStart=new Date(currentYear,currentMonth,1)
  const currentMonthStart=new Date(today.getFullYear(),today.getMonth(),1)
  if(viewedMonthStart.getTime()<currentMonthStart.getTime()){
    return totalDays-offDays.size
  }
  if(viewedMonthStart.getTime()>currentMonthStart.getTime()) return 0
  const maxDay=Math.min(today.getDate(),totalDays)
  let elapsed=0
  for(let day=1;day<=maxDay;day++){
    if(!offDays.has(day)) elapsed++
  }
  return elapsed
}

function render(){
  const days=daysInMonth(currentMonth,currentYear)
  monthTitle.innerText=months[currentMonth].toUpperCase()
  renderFarsiWordOfDay()
  scheduleFarsiWordRefresh()

  store[key()]??={habits:[],events:{},daily:{},monthly:{},tasks:{items:[]}}
  store[key()].daily??={}
  store[key()].events??={}
  store[key()].monthly??={goals:'',excited:'',insights:''}
  store[key()].tasks??={items:[]}
  if(store[key()].monthly.grateful&&!store[key()].monthly.insights){
    store[key()].monthly.insights=store[key()].monthly.grateful
  }
  if(!store[key()].monthly._rich){
    store[key()].monthly.goals=textToHtml(store[key()].monthly.goals||'')
    store[key()].monthly.excited=textToHtml(store[key()].monthly.excited||'')
    store[key()].monthly.insights=textToHtml(store[key()].monthly.insights||'')
    store[key()].monthly._rich=true
    saveQuiet()
  }
  setEditableHtml(monthlyGoals,store[key()].monthly.goals)
  setEditableHtml(monthlyExcited,store[key()].monthly.excited)
  getMonthlyChecklistBucket('monthlyTodo')
  renderMonthlyChecklistLikeDaily(monthlyChecklist,{
    bucketName:'monthlyTodo',
    placeholder:'Monthly task...',
    minRows:MONTHLY_TODO_DEFAULT_LINES
  })
  monthlyGoals.oninput=e=>{
    store[key()].monthly.goals=normalizeEditableHtml(e.target)
    store[key()].monthly._rich=true
    saveQuiet()
  }
  monthlyExcited.oninput=e=>{
    store[key()].monthly.excited=normalizeEditableHtml(e.target)
    store[key()].monthly._rich=true
    saveQuiet()
  }
  monthlyGoals.onblur=e=>clearEditableIfEmpty(e.target)
  monthlyExcited.onblur=e=>clearEditableIfEmpty(e.target)

  const activeKey=key()
  if(selectedKey!==activeKey){
    selectedKey=activeKey
    selectedDay=(currentYear===today.getFullYear()&&currentMonth===today.getMonth())?today.getDate():1
  }
  if(selectedDay>days) selectedDay=days
  setSelectedDay(selectedDay,days)

  table.innerHTML=''
  const habitsInView=store[key()].habits||[]
  let colorChanged=false
  habitsInView.forEach(habit=>{
    const normalized=normalizeHabitColor(habit?.color)
    if(habit.color!==normalized){
      habit.color=normalized
      colorChanged=true
    }
  })
  if(colorChanged) saveQuiet()
  const offDays=getOffDaySet(days)
  const monthData=store[key()]
  if(!monthData.offDays||typeof monthData.offDays!=='object'||Array.isArray(monthData.offDays)){
    monthData.offDays={}
    saveQuiet()
  }
  const allDoneDays=new Set()
  if(habitsInView.length){
    for(let d=1;d<=days;d++){
      if(offDays.has(d)) continue
      const allDone=habitsInView.every(h=>isCheckedState(h?.checks?.[d]))
      if(allDone) allDoneDays.add(d)
    }
  }
  const todayDay=(
    currentYear===today.getFullYear()&&
    currentMonth===today.getMonth()
  )?today.getDate():0

  const h1=document.createElement('tr')
  h1.innerHTML='<th class="habit-col">Habit</th>'+
    Array.from({length:days},(_,i)=>{
      const day=i+1
      const wd=weekdays[(i+new Date(currentYear,currentMonth,1).getDay())%7]
      const offClass=offDays.has(day)?' off-day':''
      const todayColClass=day===todayDay?' today-col':''
      return `<th class="weekday ${wd}${offClass}${todayColClass}" data-day="${day}">${wd[0].toUpperCase()}</th>`
    }).join('')+
    '<th class="icon-col">Icon</th><th>/GOAL</th><th>Status</th>'
  table.appendChild(h1)

  const h2=document.createElement('tr')
  const dailyData=store[key()].daily||{}
  const isPastDay=(day)=>{
    const viewDate=new Date(currentYear,currentMonth,day)
    const todayDate=new Date(today.getFullYear(),today.getMonth(),today.getDate())
    return viewDate<todayDate
  }
  const hasText=(value)=>typeof value==='string'&&value.trim().length>0
  h2.innerHTML='<th class="habit-col"></th>'+
    Array.from({length:days},(_,i)=>{
      const day=i+1
      const daily=dailyData[String(day)]
      const hasDream=hasText(daily?.dream)
  const hasJournal=hasText(daily?.journal)
  const hasGrateful=Array.isArray(daily?.grateful)&&daily.grateful.some(item=>hasText(item))
      const marks=[
    isPastDay(day)&&hasDream?'dream-mark':'',
    isPastDay(day)&&hasJournal?'journal-mark':'',
    hasGrateful?'grateful-mark':'',
    offDays.has(day)?'off-day':''
  ].filter(Boolean).join(' ')
      const todayClass=day===todayDay?'today-mark today-col':''
      return `<th class="day-cell ${marks} ${todayClass}" data-day="${day}">${day}</th>`
    }).join('')+
    '<th class="icon-col"></th><th></th><th></th>'
  table.appendChild(h2)

  table.querySelectorAll('.day-cell').forEach(cell=>{
    cell.addEventListener('click',()=>{
      setSelectedDay(Number(cell.dataset.day),days)
      table.querySelectorAll('.day-cell').forEach(c=>c.classList.remove('selected'))
      cell.classList.add('selected')
    })
  })
  table.querySelectorAll('.weekday').forEach(cell=>{
    cell.addEventListener('dblclick',e=>{
      e.preventDefault()
      toggleOffDay(Number(cell.dataset.day),days)
    })
  })
  const selectedCell=table.querySelector(`.day-cell[data-day="${selectedDay}"]`)
  if(selectedCell) selectedCell.classList.add('selected')

  habitsInView.forEach((h,hi)=>{
    const tr=document.createElement('tr')
    tr.className='habit-row'
    tr.draggable=true
    tr.ondragstart=e=>e.dataTransfer.setData('i',hi)
    tr.ondragover=e=>e.preventDefault()
    tr.ondrop=e=>{
      const from=e.dataTransfer.getData('i')
      const arr=store[key()].habits
      arr.splice(hi,0,arr.splice(from,1)[0])
      save()
    }

    let total=0
    const rowTint=habitRowTint(h.color)
    const nameTd=document.createElement('td')
    nameTd.className='habit-col'
    nameTd.style.backgroundColor=rowTint
    nameTd.innerHTML=`<div class="habit-wrap"><span class="habit-name">${escapeHtml(h.name)}</span><span class="edit" onclick="editHabit(${hi})">✏️</span></div>`
    tr.appendChild(nameTd)

    for(let d=1;d<=days;d++){
      const td=document.createElement('td')
      td.style.backgroundColor=habitCellTint(h.color)
      const isOffDay=offDays.has(d)
      if(allDoneDays.has(d)){
        td.classList.add('all-habits-day-cell')
      }
      if(d===todayDay){
        td.classList.add('today-col')
      }
      if(isOffDay){
        td.classList.add('off-day-cell')
      }
      const box=document.createElement('div')
      const state=h.checks[d]
      box.className='checkbox'+(state===true?' checked':'')+(state==='yellow'?' checked-yellow':'')
      box.style.setProperty('--check-base',habitCheckboxTint(h.color))
      if(isOffDay){
        box.classList.add('off-day-checkbox')
        box.title='Off day'
      }
      if(!isOffDay){
        total+=checkValue(state)
        box.addEventListener('click',e=>{
          const yellow=e.metaKey||e.ctrlKey
          const currentState=h.checks[d]
          const addingTick=!yellow&&currentState!==true
          if(addingTick){
            triggerHabitTickPop(tr,h.icon||'✅')
          }
          toggle(hi,d,yellow?'yellow':'full',{delayGoalChange:true})
        })
      }
      td.appendChild(box)
      tr.appendChild(td)
    }

    const goalValue=Math.max(1,Number(h.goal)||0)
    const actualGoalHit=total>=goalValue
    const habitRenderKey=`${key()}:${hi}`
    const delayUntil=goalHitDelayUntil.get(habitRenderKey)||0
    const delayed=Date.now()<delayUntil
    const goalHit=delayed?(goalHitMemory.get(habitRenderKey)===true):actualGoalHit
    if(!delayed&&delayUntil){
      goalHitDelayUntil.delete(habitRenderKey)
      const delayTimer=goalHitDelayTimers.get(habitRenderKey)
      if(delayTimer){
        clearTimeout(delayTimer)
        goalHitDelayTimers.delete(habitRenderKey)
      }
    }
    const prevGoalHit=goalHitMemory.get(habitRenderKey)===true
    if(goalHit){
      tr.classList.add('goal-hit')
      nameTd.classList.add('goal-hit-name')
    }
    const iconTd=document.createElement('td')
    iconTd.className='icon-col'
    iconTd.style.backgroundColor=rowTint
    iconTd.innerText=h.icon||''
    tr.appendChild(iconTd)
    const trackableDays=Math.max(0,days-offDays.size)
    const elapsedDays=getElapsedTrackableDays(days,offDays)
    const projectedTotal=elapsedDays>0?(total/elapsedDays)*trackableDays:0
    const completionPct=goalValue>0?Math.round((total/goalValue)*100):100
    const targetByNow=elapsedDays>0&&trackableDays>0?(goalValue*(elapsedDays/trackableDays)):0
    const paceDelta=elapsedDays>0?(total-targetByNow):0
    const totalGoalTd=document.createElement('td')
    totalGoalTd.className='total-goal-cell'
    totalGoalTd.style.backgroundColor=rowTint
    const totalValue=document.createElement('span')
    totalValue.className='total-goal-value'
    totalValue.innerText=formatProgress(total)
    const totalGoalSep=document.createElement('span')
    totalGoalSep.className='total-goal-sep'
    totalGoalSep.innerText='/'
    const goalInput=document.createElement('input')
    goalInput.className='goal-input goal-inline-input'
    goalInput.type='number'
    goalInput.value=h.goal
    goalInput.addEventListener('change',e=>{
      store[key()].habits[hi].goal=+e.target.value
      save()
    })
    totalGoalTd.appendChild(totalValue)
    totalGoalTd.appendChild(totalGoalSep)
    totalGoalTd.appendChild(goalInput)
    tr.appendChild(totalGoalTd)

    const pctTd=document.createElement('td')
    pctTd.style.backgroundColor=rowTint
    if(goalHit){
      pctTd.innerText='🏆'
      pctTd.className='pct-good'
      pctTd.title=`Goal achieved. Completed so far: ${formatProgress(total)} (${completionPct}%). Goal: ${goalValue}. Off days do not count toward this goal.`
    }else if(elapsedDays===0){
      pctTd.innerText='🙂'
      pctTd.className='pct-neutral'
      pctTd.title='Month has not started yet.'
    }else{
      const remainingDays=Math.max(0,trackableDays-elapsedDays)
      const remainingNeeded=Math.max(0,goalValue-total)
      const canStillHitGoal=remainingNeeded<=remainingDays
      const deficitDays=remainingNeeded-remainingDays
      const projectedRounded=Math.round(projectedTotal*10)/10
      const paceRounded=Math.round(paceDelta*10)/10
      const status=getHabitStatus({
        goalHit,remainingDays,remainingNeeded,canStillHitGoal,deficitDays,paceDelta,projectedTotal,goalValue
      })
      pctTd.className=status.className
      pctTd.innerText=status.emoji
      pctTd.title=`Status: ${status.label}. Completed so far: ${formatProgress(total)} (${completionPct}%). Goal: ${goalValue}. Off days do not count toward this goal. Remaining needed: ${formatProgress(remainingNeeded)} in ${remainingDays} day(s). Projected month-end: ${projectedRounded}. Pace vs target today: ${paceRounded>=0?'+':''}${paceRounded}.`
    }
    tr.appendChild(pctTd)
    if(goalHitMemoryPrimed&&goalHit&&!prevGoalHit){
      triggerGoalCelebration(tr)
    }
    goalHitMemory.set(habitRenderKey,goalHit)

    table.appendChild(tr)
  })
  goalHitMemoryPrimed=true
}

dreamsBtn.addEventListener('click',openDreamModal)
dreamBackdrop.addEventListener('click',closeDreamModal)
dreamClose.addEventListener('click',closeDreamModal)
dreamText.addEventListener('input',e=>{
  if(selectedDay===null) return
  const daily=getDaily(selectedDay)
  daily.dream=normalizeEditableHtml(e.target)
  daily._rich=true
  saveQuiet()
})
dreamText.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
journalBtn.addEventListener('click',openJournalModal)
journalBackdrop.addEventListener('click',closeJournalModal)
journalClose.addEventListener('click',closeJournalModal)
journalText.addEventListener('input',e=>{
  if(selectedDay===null) return
  const daily=getDaily(selectedDay)
  daily.journal=normalizeEditableHtml(e.target)
  daily._rich=true
  saveQuiet()
})
journalText.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
gratefulBtn.addEventListener('click',openGratefulModal)
gratefulBackdrop.addEventListener('click',closeGratefulModal)
gratefulClose.addEventListener('click',closeGratefulModal)
simpleTodoBtn.addEventListener('click',openSimpleTodoModal)
simpleTodoBackdrop.addEventListener('click',closeSimpleTodoModal)
simpleTodoClose.addEventListener('click',closeSimpleTodoModal)
gratefulInputs.forEach((input,i)=>{
  input.addEventListener('input',e=>{
    if(selectedDay===null) return
    const daily=getDaily(selectedDay)
    daily.grateful[i]=normalizeEditableHtml(e.target)
    daily._rich=true
    saveQuiet()
  })
  input.addEventListener('blur',e=>clearEditableIfEmpty(e.target))
})
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&dreamModal.classList.contains('show')){
    closeDreamModal()
  }
  if(e.key==='Escape'&&habitModal.classList.contains('show')){
    closeHabitModal()
  }
  if(e.key==='Escape'&&journalModal.classList.contains('show')){
    closeJournalModal()
  }
  if(e.key==='Escape'&&gratefulModal.classList.contains('show')){
    closeGratefulModal()
  }
  if(e.key==='Escape'&&simpleTodoModal.classList.contains('show')){
    closeSimpleTodoModal()
  }
})

addHabitBtn.addEventListener('click',()=>openHabitModal('add'))
habitBackdrop.addEventListener('click',closeHabitModal)
habitCancel.addEventListener('click',closeHabitModal)
habitDelete.addEventListener('click',()=>{
  if(editingHabitIndex===null) return
  const h=store[key()].habits[editingHabitIndex]
  const name=h?.name||'this habit'
  if(!confirm(`Delete habit "${name}"?`)) return
  store[key()].habits.splice(editingHabitIndex,1)
  save()
  closeHabitModal()
})
habitSave.addEventListener('click',()=>{
  const name=habitNameInput.value.trim()
  const icon=habitIconInput.value.trim()
  const color=normalizeHabitColor(habitColorSelect.value)
  if(!name) return
  if(editingHabitIndex===null){
    addHabit(name,icon,color)
  }else{
    const h=store[key()].habits[editingHabitIndex]
    if(h){
      h.name=name
      h.icon=icon
      h.color=color
    }
    save()
  }
  closeHabitModal()
})
habitColorSelect.addEventListener('change',updateHabitColorPreview)

function closeContextMenu(){
  contextMenu.classList.remove('show')
  contextMenu.setAttribute('aria-hidden','true')
  contextRange=null
  contextEditable=null
}

function openContextMenu(x,y,range,editable){
  contextRange=range
  contextEditable=editable
  contextMenu.classList.add('show')
  contextMenu.setAttribute('aria-hidden','false')
  contextMenu.style.left=`${x}px`
  contextMenu.style.top=`${y}px`
  const rect=contextMenu.getBoundingClientRect()
  const pad=8
  let nx=x
  let ny=y
  if(rect.right>window.innerWidth-pad){
    nx=window.innerWidth-rect.width-pad
  }
  if(rect.bottom>window.innerHeight-pad){
    ny=window.innerHeight-rect.height-pad
  }
  contextMenu.style.left=`${Math.max(pad,nx)}px`
  contextMenu.style.top=`${Math.max(pad,ny)}px`
}

function restoreContextSelection(){
  if(!contextEditable) return false
  contextEditable.focus()
  if(!contextRange) return true
  const selection=window.getSelection()
  selection.removeAllRanges()
  selection.addRange(contextRange)
  return true
}

function insertEmoji(emoji){
  if(!emoji) return
  const selection=window.getSelection()
  const makeSpacer=(needsSpace)=>needsSpace?' ':''
  if(selection.rangeCount){
    const range=selection.getRangeAt(0)
    range.deleteContents()
    const beforeChar=(()=>{
      const node=range.startContainer
      if(node.nodeType===Node.TEXT_NODE){
        return node.textContent?.[range.startOffset-1]||''
      }
      return ''
    })()
    const afterChar=(()=>{
      const node=range.startContainer
      if(node.nodeType===Node.TEXT_NODE){
        return node.textContent?.[range.startOffset]||''
      }
      return ''
    })()
    const needsLead=beforeChar&&!/\s/.test(beforeChar)
    const needsTrail=afterChar&&!/\s/.test(afterChar)
    const text=makeSpacer(needsLead)+emoji+makeSpacer(needsTrail)
    range.insertNode(document.createTextNode(text))
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  }else if(contextEditable){
    const text=emoji+' '
    contextEditable.appendChild(document.createTextNode(text))
  }
  contextEditable?.dispatchEvent(new Event('input',{bubbles:true}))
}

contextMenu.addEventListener('click',e=>{
  const button=e.target.closest('button')
  if(!button) return
  if(!restoreContextSelection()) return
  const cmd=button.dataset.cmd
  const color=button.dataset.color
  const emoji=button.dataset.emoji
  if(cmd){
    document.execCommand(cmd,false,null)
  }
  if(color){
    document.execCommand('foreColor',false,color)
  }
  if(emoji){
    insertEmoji(emoji)
  }
  closeContextMenu()
})

document.addEventListener('contextmenu',e=>{
  const editable=e.target.closest('[contenteditable="true"]')
  if(!editable){
    closeContextMenu()
    return
  }
  e.preventDefault()
  const selection=window.getSelection()
  let range=null
  if(selection.rangeCount){
    const candidate=selection.getRangeAt(0)
    if(editable.contains(candidate.startContainer)){
      range=candidate
    }
  }
  openContextMenu(e.clientX,e.clientY,range,editable)
})
contextMenu.addEventListener('contextmenu',e=>e.preventDefault())
document.addEventListener('click',e=>{
  if(contextMenu.classList.contains('show')&&!contextMenu.contains(e.target)){
    closeContextMenu()
  }
})
document.addEventListener('keydown',e=>{
  const editable=e.target.closest('[contenteditable="true"]')
  if(!editable) return
  if(e.key!==' '||e.metaKey||e.ctrlKey||e.altKey){
    baselineResetSpaceAt.delete(editable)
    return
  }
  const now=Date.now()
  const prev=baselineResetSpaceAt.get(editable)||0
  baselineResetSpaceAt.set(editable,now)
  if(now-prev<=500){
    resetTypingBaseline(editable)
    baselineResetSpaceAt.delete(editable)
  }
})
window.addEventListener('blur',closeContextMenu)
window.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&contextMenu.classList.contains('show')){
    closeContextMenu()
  }
})

initSelectors()
initHabitColorSelect()
updateBackupButtonState(false)
render()
initCloudSync()

backupBtn?.addEventListener('click',chooseBackupFolder)
restoreBtn?.addEventListener('click',triggerRestorePicker)
restoreInput?.addEventListener('change',handleRestoreFileInput)

prevDayBtn.addEventListener('click',()=>{
  selectedDay-=1
  render()
})
nextDayBtn.addEventListener('click',()=>{
  selectedDay+=1
  render()
})
todayBtn.addEventListener('click',()=>{
  currentMonth=today.getMonth()
  currentYear=today.getFullYear()
  monthSelect.value=currentMonth
  yearSelect.value=currentYear
  selectedDay=today.getDate()
  render()
})
