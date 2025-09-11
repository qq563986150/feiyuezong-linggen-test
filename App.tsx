import React, { useState, useRef, useEffect } from 'react';
import IdentityCard from './components/IdentityCard';
import SpiritRootModal from './components/SpiritRootModal';

// Declare the htmlToImage library which is loaded via script tag in index.html
declare const htmlToImage: any;

// --- CORRECT WAY: Define the default background as a link to a local file ---
// The user should place an image named 'default-background.jpg' in the same folder as index.html
const defaultBg = './default-background.jpg';

type BorderStyle = 'gold' | 'wood' | 'water' | 'fire' | 'earth';
type TestStatus = 'idle' | 'testing' | 'complete';

const borderOptions: { id: BorderStyle; name: string; gradient: string }[] = [
  { id: 'gold', name: '皓金', gradient: 'bg-gradient-to-br from-[#FFFFFF] to-[#FFD700]' },
  { id: 'wood', name: '灵木', gradient: 'bg-gradient-to-br from-[#6EE7B7] to-[#16A34A]' },
  { id: 'water', name: '玄水', gradient: 'bg-gradient-to-br from-[#7DD3FC] to-[#0C4A6E]' },
  { id: 'fire', name: '赤炎', gradient: 'bg-gradient-to-br from-[#F97316] to-[#991B1B]' },
  { id: 'earth', name: '厚土', gradient: 'bg-gradient-to-br from-[#FBBF24] to-[#78350F]' },
];

const aptitudePairs: { spiritRoot: string; constitution: string }[] = [
    { spiritRoot: '天灵根 (火)', constitution: '纯阳之体' },
    { spiritRoot: '变异灵根 (冰)', constitution: '纯阴之体' },
    { spiritRoot: '真灵根 (金、木、水)', constitution: '凡体 (良)' }, // Triple Spirit Root
    { spiritRoot: '伪灵根 (水、火、土)', constitution: '凡体 (差)' },
    { spiritRoot: '天灵根 (水)', constitution: '通玉凤髓之体' },
    { spiritRoot: '真灵根 (木、土)', constitution: '凡体 (良)' },
    { spiritRoot: '伪灵根 (金、木、水、火、土)', constitution: '凡体 (差)' },
    { spiritRoot: '天灵根 (土)', constitution: '凡体 (优)' },
    { spiritRoot: '隐灵根 (隐暗)', constitution: '先天道体' }, // Rare root with rare constitution
    { spiritRoot: '真灵根 (水、木)', constitution: '凡体 (良)' },
    { spiritRoot: '隐灵根 (隐雷)', constitution: '混沌之体' }, // Rare root with rare constitution
    { spiritRoot: '真灵根 (火、土)', constitution: '凡体 (优)' },
    { spiritRoot: '伪灵根 (金、木、水、火)', constitution: '凡体 (差)' },
    { spiritRoot: '天灵根 (金)', constitution: '凡体 (优)' },
    { spiritRoot: '变异灵根 (雷)', constitution: '龙吟之体' },
    { spiritRoot: '变异灵根 (风)', constitution: '通玉凤髓之体' }, // New Wind Spirit Root
];

const peaks: string[] = [
    '逍遥峰', '血月峰', '紫薇峰', '太华峰', '落霞峰', '御剑峰', '凤曦峰', '血影峰', '青云峰'
];

const lore: Record<string, string> = {
    '天灵根': '上天宠儿，修炼速度为常人2-3倍，结丹无瓶颈。',
    '隐灵根': '千年难遇，潜力不逊天灵根，需特殊机遇觉醒。',
    '变异灵根': '五行异变升华，战力卓绝，可敌数位同阶修士。',
    '真灵根': '修炼良材，资质上佳，筑基成功率远超常人。',
    '伪灵根': '资质驳杂，修炼缓慢，需大毅力或奇遇破境。',
    '龙吟之体': '阴阳失衡，天赋异禀，修炼神速但暗藏凶险。',
    '通玉凤髓之体': '体内自生先天灵气，修炼事半功倍，可辅助他人。',
    '纯阴之体': '体质极阴，修炼阴寒功法一日千里，需丹药调和。',
    '纯阳之体': '体质极阳，修炼阳系功法威力巨大，谨防走火入魔。',
    '先天道体': '天生与道相亲，感悟法则极快，万年难遇之才。',
    '混沌之体': '包容万物，可修任何功法，仅存于上古传说之中。',
    '凡体': '根基虽普通，但若心志坚定，亦可凭借勤勉补拙。',
    '灵根未测': '资质尚待检测，未来道途充满了未知的可能性。',
    '风': '身法诡异，速度冠绝，机动性极强，难以捕捉。', // New Lore for Wind
};


const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [gender, setGender] = useState<string>('男');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(defaultBg);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('fire');
  const [spiritRoot, setSpiritRoot] = useState<string>('灵根未测');
  const [constitution, setConstitution] = useState<string>('凡体');
  const [description, setDescription] = useState<string>('');
  const [serialNumber, setSerialNumber] = useState<string>('序列生成中...');
  const [peak, setPeak] = useState<string>('未分配');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');

  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateSerialNumber = (root: string | null, date: string): string => {
      if (!root || root === '灵根未测') {
        return '未入籍';
      }
  
      const prefixMap: Record<string, string> = {
        '天': '天', '隐': '玄', '变': '异', '真': '真', '伪': '凡'
      };
      const prefix = prefixMap[root.charAt(0)] || '凡';
  
      const datePart = date.replace(/-/g, '');
  
      const randomPart = Math.floor(1000 + Math.random() * 9000);
  
      return `${prefix}-${datePart}-${randomPart}`;
    };
  
    setSerialNumber(generateSerialNumber(spiritRoot, entryDate));
  }, [spiritRoot, entryDate]);

  useEffect(() => {
    const getDescription = (): string => {
        const constitutionBase = constitution.split(' ')[0];
        if (constitution && !constitution.startsWith('凡体') && lore[constitutionBase]) {
            return lore[constitutionBase];
        }
        if (spiritRoot) {
            if (spiritRoot.includes('风')) return lore['风'];
            const rootType = spiritRoot.split(' ')[0];
            return lore[rootType] || lore['凡体'];
        }
        return lore['灵根未测'];
    };
    setDescription(getDescription());
  }, [spiritRoot, constitution]);

  const handleStartTest = () => {
    if (isTesting) return;
    setIsTesting(true);
    setTestStatus('testing');

    setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * aptitudePairs.length);
        const { spiritRoot: nextRoot, constitution: nextConstitution } = aptitudePairs[randomIndex];
        
        const randomPeakIndex = Math.floor(Math.random() * peaks.length);
        const nextPeak = peaks[randomPeakIndex];

        setSpiritRoot(nextRoot);
        setConstitution(nextConstitution);
        setPeak(nextPeak);
        
        setTestStatus('complete');
        setTimeout(() => {
            setIsTesting(false);
            setTestStatus('idle');
        }, 800);
    }, 1000); // Duration changed to 1 second
  };

  const validateField = (field: string, value: any): string | null => {
    switch(field) {
      case 'name':
        if (!value.trim()) return '姓名不能为空 (Name cannot be empty)';
        if (value.length > 10) return '姓名过长，最多10个字符 (Name is too long, max 10 chars)';
        return null;
      case 'entryDate':
        if (!value) return '请选择入宗日期 (Please select an entry date)';
        if (new Date(value) > new Date()) return '入宗日期不能是未来 (Entry date cannot be in the future)';
        return null;
      case 'image':
        if (value instanceof File) {
            const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!supportedTypes.includes(value.type)) {
                return '格式无效，请上传 JPG, PNG, GIF, 或 WEBP 图片。';
            }
            if (value.size > maxSize) {
                return '文件过大，请上传小于 5MB 的图片。';
            }
        }
        return null;
      default:
        return null;
    }
  }

  const setFieldError = (field: string, error: string | null) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setFieldError('name', validateField('name', newName));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setEntryDate(newDate);
    setFieldError('entryDate', validateField('entryDate', newDate));
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profilePic' | 'backgroundImage') => {
    const file = e.target.files?.[0];
    const setter = fieldName === 'profilePic' ? setProfilePic : setBackgroundImage;

    if (file) {
      const error = validateField('image', file);
      setFieldError(fieldName, error);

      if (error) {
        e.target.value = ''; // Reset file input
        // Do not clear image on validation error of a new file, keep the old one
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        // Only clear if the user cancels file selection, not by default.
        // setter(null); 
        setFieldError(fieldName, null);
    }
  };
  
  const validateForm = (): boolean => {
    const nameError = validateField('name', name);
    const dateError = validateField('entryDate', entryDate);
    
    const newErrors = { ...errors };
    if (nameError) newErrors.name = nameError; else delete newErrors.name;
    if (dateError) newErrors.entryDate = dateError; else delete newErrors.dateError;

    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  }
  
  const handleRemoveBackground = () => {
    setBackgroundImage(null);
    // Also clear the file input for consistency
    const input = document.getElementById('cardBackground') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleRestoreDefault = () => {
    setBackgroundImage(defaultBg);
    const input = document.getElementById('cardBackground') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };


  const handleSave = async () => {
    if (!validateForm()) {
        alert("请修正表单中的错误再保存。(Please fix the errors in the form before saving.)");
        return;
    }
    if (!cardRef.current) {
        alert("无法找到卡片元素，请刷新页面重试。(Cannot find card element, please refresh and try again.)");
        return;
    }

    setIsSaving(true);
    
    try {
        const dataUrl = await htmlToImage.toJpeg(cardRef.current, { 
            quality: 0.95,
            canvasWidth: 700,
            canvasHeight: 1100,
            style: {
                width: '700px',
                height: '1100px',
                margin: '0',
            },
            cacheBust: true,
        });

        const link = document.createElement('a');
        link.download = `绯月宗-身份卡-${name || '弟子'}.jpeg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("保存图片失败 (Failed to save image):", error);
        alert("抱歉，保存图片时发生意外错误。可能是由于浏览器限制或图片过于复杂。请尝试刷新页面或使用其他浏览器。(Sorry, an unexpected error occurred while saving the image. It might be due to browser limitations or image complexity. Please try refreshing the page or using a different browser.)");
    } finally {
        setIsSaving(false);
    }
  };

  const getInputClass = (field: string) => 
    `w-full bg-gray-900/50 border rounded-md py-2 px-3 focus:outline-none focus:ring-2 transition-colors ${
      errors[field] 
        ? 'border-red-500/80 ring-red-500/50' 
        : 'border-gray-600 focus:border-red-500 focus:ring-red-500/50'
    }`;

  const getFileClass = (field: string, accent: 'red' | 'gray' = 'red') => 
    `w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:cursor-pointer transition-colors
     ${getInputClass(field)} 
     file:bg-transparent
     ${accent === 'red' ? 'file:text-red-300 hover:file:text-red-200' : 'file:text-gray-300 hover:file:text-gray-100'}
     `;

  return (
    <div className="min-h-screen text-white font-noto-serif p-4 sm:p-8 flex items-center justify-center">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="flex items-center justify-center">
            <div className="w-full max-w-[700px] bg-black/20 backdrop-blur-sm p-8 rounded-l-2xl rounded-r-[60px] border border-gray-700/50 shadow-2xl shadow-red-900/20">
              <h1 className="font-zcool text-6xl font-bold text-center mb-10 bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent" style={{ textShadow: '0 4px 6px rgba(0,0,0,0.6)' }}>
                绯月宗测试灵根生成器
              </h1>

              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">姓名</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={handleNameChange} 
                    className={getInputClass('name')} 
                    placeholder="请输入姓名"
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                  />
                  {errors.name && <p id="name-error" className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">性别</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input type="radio" value="男" checked={gender === '男'} onChange={(e) => setGender(e.target.value)} className="form-radio h-4 w-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-600" />
                      <span className="ml-2">男</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" value="女" checked={gender === '女'} onChange={(e) => setGender(e.target.value)} className="form-radio h-4 w-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-600" />
                      <span className="ml-2">女</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="entryDate" className="block text-sm font-medium text-gray-300 mb-2">入宗日期</label>
                  <input 
                    type="date" 
                    id="entryDate" 
                    value={entryDate} 
                    onChange={handleDateChange} 
                    className={getInputClass('entryDate')} 
                    aria-invalid={!!errors.entryDate}
                    aria-describedby="entryDate-error"
                  />
                  {errors.entryDate && <p id="entryDate-error" className="text-red-400 text-sm mt-1">{errors.entryDate}</p>}
                </div>

                <div>
                  <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300 mb-2">头像</label>
                  <input 
                    type="file" 
                    id="profilePic" 
                    onChange={(e) => handleImageUpload(e, 'profilePic')} 
                    accept="image/jpeg,image/png,image/gif,image/webp" 
                    className={getFileClass('profilePic', 'red')}
                    aria-describedby="profilePic-error"
                  />
                  {errors.profilePic && <p id="profilePic-error" className="text-red-400 text-sm mt-1">{errors.profilePic}</p>}
                </div>
                
                <div>
                  <label htmlFor="cardBackground" className="block text-sm font-medium text-gray-300 mb-2">卡片背景 (可选)</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      id="cardBackground" 
                      onChange={(e) => handleImageUpload(e, 'backgroundImage')} 
                      accept="image/jpeg,image/png,image/gif,image/webp" 
                      className={getFileClass('backgroundImage', 'gray')}
                      aria-describedby="backgroundImage-error"
                    />
                     {backgroundImage && (
                       <button onClick={handleRemoveBackground} className="text-gray-400 hover:text-white transition-colors" title="移除背景">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                       </button>
                     )}
                     {backgroundImage !== defaultBg && (
                       <button onClick={handleRestoreDefault} className="text-gray-400 hover:text-white transition-colors" title="恢复默认背景">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l16 16" />
                         </svg>
                       </button>
                     )}
                  </div>
                  {errors.backgroundImage && <p id="backgroundImage-error" className="text-red-400 text-sm mt-1">{errors.backgroundImage}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">边框样式 (五行)</label>
                  <div className="flex flex-wrap gap-2">
                    {borderOptions.map((opt) => (
                      <button key={opt.id} onClick={() => setBorderStyle(opt.id)} className={`w-12 h-10 rounded-md ${opt.gradient} text-black font-bold flex items-center justify-center transition-all duration-300 ${borderStyle === opt.id ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : 'opacity-70 hover:opacity-100'}`}>
                        {opt.name}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="pt-2">
                   <button onClick={handleStartTest} disabled={isTesting} className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-full shadow-lg hover:from-teal-400 hover:to-cyan-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                     {isTesting ? '正在检测资质...' : '开始测试灵根'}
                   </button>
                </div>
              </div>
            </div>
        </div>
        
        <div className="flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-6 w-full">
              <IdentityCard 
                ref={cardRef}
                name={name} 
                gender={gender} 
                entryDate={entryDate} 
                profilePic={profilePic} 
                borderStyle={borderStyle} 
                spiritRoot={spiritRoot}
                constitution={constitution}
                description={description}
                backgroundImage={backgroundImage}
                serialNumber={serialNumber}
                peak={peak}
              />
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full max-w-[700px] py-4 px-6 text-lg bg-gradient-to-r from-red-600 to-rose-700 text-white font-bold rounded-full shadow-lg hover:from-red-500 hover:to-rose-600 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    正在保存...
                  </>
                ) : (
                  '保存身份卡'
                )}
              </button>
            </div>
        </div>

      </div>
      <SpiritRootModal isOpen={isTesting} status={testStatus} />
    </div>
  );
};

export default App;