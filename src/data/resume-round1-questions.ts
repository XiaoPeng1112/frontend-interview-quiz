import { Question } from './types';

export const resumeRound1Questions: Question[] = [
  {
    id: 3001,
    category: '一面追问',
    difficulty: 'easy',
    question: 'RN 的渲染流程是什么？从 JSX 到屏幕上看到像素经历了哪些步骤？',
    answer: `RN 渲染全流程：
1. JSX 编译：Babel 将 JSX 编译为 React.createElement 调用
2. Reconciler：React 执行组件函数，生成 Virtual DOM 树
3. Diff 计算：对比新旧 VDOM，生成变更指令
4. 传输：变更通过 Bridge/JSI 传递给 Native 端
5. Shadow Tree：Yoga 引擎计算 Flexbox 布局
6. Native 渲染：创建/更新原生 View 层级
7. GPU 合成：系统光栅化，提交 GPU 绘制

与 Web 区别：没有 DOM，直接映射原生组件；布局计算在独立线程。`,
  },
  {
    id: 3002,
    category: '一面追问',
    difficulty: 'easy',
    question: 'Hooks 调用规则有哪些？为什么不能在条件语句里用 Hook？',
    answer: `规则：
1. 只在函数组件或自定义 Hook 顶层调用
2. 不能在 if/for/嵌套函数中调用

原因：React 用调用顺序追踪每个 Hook 的状态，形成链表：
useState('a')  -> memoizedState[0]
useEffect(...) -> memoizedState[1]
useState('b')  -> memoizedState[2]

条件语句会导致某次渲染跳过某个 Hook，后续所有 Hook 索引错位，状态混乱。

项目实践：MRN 模块中封装了 useModuleData、useExposure 等自定义 Hooks，ESLint exhaustive-deps 强制检查依赖数组。`,
  },
  {
    id: 3003,
    category: '一面追问',
    difficulty: 'easy',
    question: '什么是布局跳变？在 RN 中怎么避免首屏跳变？',
    answer: `布局跳变：页面元素在渲染过程中位置/尺寸突然变化，导致视觉抖动。

RN 中典型场景和解决方案：
1. 图片加载撑开高度 -> 预设 aspectRatio 或固定宽高
2. 异步数据导致模块出现/消失 -> 骨架屏占位
3. SKU 切换后价格宽度变化 -> 最小宽度约束
4. 字体加载 -> 预加载字体资源

系统性方案：
- MRNBox 快照：用缓存数据先渲染首屏，消除最大的白屏->有内容跳变
- 批量更新：unstable_batchedUpdates 合并多个状态变更
- 渐显动画：opacity 0->1 过渡，视觉更平滑`,
  },
  {
    id: 3004,
    category: '一面追问',
    difficulty: 'easy',
    question: 'RN 中的 Flexbox 和 Web CSS Flexbox 有什么区别？',
    answer: `主要区别：
1. 默认方向：RN 默认 column，Web 默认 row
2. flex 简写：RN 的 flex:1 等于 flexGrow:1+flexShrink:1+flexBasis:0
3. 不支持 gap（RN 0.71 之前），用 margin 模拟
4. 百分比：父容器必须有确定尺寸，否则百分比无效
5. overflow：RN 默认 hidden，Web 默认 visible
6. 单位：RN 没有 px/rem，数字默认 dp（逻辑像素）

项目应用：
- 详情页模块垂直排列：flexDirection: 'column'
- BottomBar 水平排列：flexDirection: 'row', justifyContent: 'space-between'
- SKU 标签网格：flexWrap: 'wrap' + 固定宽度`,
  },
  {
    id: 3005,
    category: '一面追问',
    difficulty: 'easy',
    question: '解释一下 Promise 和 async/await？在 RN 项目中怎么处理多个并发请求？',
    answer: `Promise：异步操作的容器，有 pending/fulfilled/rejected 三种状态。
async/await：Promise 的语法糖，让异步代码看起来像同步。

并发请求处理：

1. Promise.all（全部成功才返回）：
const [userInfo, skuData, storeList] = await Promise.all([
    fetchUser(), fetchSku(), fetchStores()
]);
// 任一失败则整体失败

2. Promise.allSettled（不管成功失败都返回）：
const results = await Promise.allSettled([...]);
// 适合非关键模块，部分失败不影响整体

3. Promise.race（取最快的）：
// 用于超时控制
const data = await Promise.race([
    fetchBFF(),
    new Promise((_, reject) => setTimeout(() => reject('timeout'), 3000))
]);

项目实践：
- BFF 聚合了多个后端接口，前端一次请求即可
- 非 BFF 场景用 Promise.all 并发请求多个独立接口
- 配合 AbortController 做请求取消`,
  },
  {
    id: 3006,
    category: '一面追问',
    difficulty: 'easy',
    question: '你项目中使用了 aHooks，常用哪些 Hook？和自己实现有什么区别？',
    answer: `aHooks 常用 Hook：

1. useRequest：请求管理（loading/error/data/retry/轮询/防抖）
2. useDebounceFn / useThrottleFn：防抖节流
3. useMount / useUnmount：生命周期
4. useSetState：合并式 setState（类似 class 组件）
5. useLocalStorageState：持久化状态
6. usePrevious：获取上一次的值
7. useUpdateEffect：跳过首次执行的 useEffect

和自己实现的区别：
- 边界处理更完善（组件卸载后不 setState）
- 类型定义完整（TS 泛型支持）
- 经过大量生产验证
- 统一团队代码风格

示例（建盛材全局搜索）：
const { run: doSearch, cancel } = useDebounceFn(
    (keyword) => {
        controller.current?.abort();
        controller.current = new AbortController();
        fetchSearch(keyword, { signal: controller.current.signal });
    },
    { wait: 300 }
);`,
  },
  {
    id: 3007,
    category: '一面追问',
    difficulty: 'medium',
    question: '详细说说「点击预请求」是怎么实现的？和 Bundle 预加载是怎么配合的？',
    answer: `传统流程（串行）：
用户点击 -> 打开容器 -> 加载Bundle -> 执行JS -> 发BFF请求 -> 等响应 -> 渲染
总耗时 = Bundle(300ms) + 网络(200ms) + 渲染(100ms) = 600ms

优化流程（并行）：
用户点击 -> Native立即发起BFF预请求（不等Bundle）
         -> 同时打开容器+加载Bundle
         -> Bundle就绪时数据已经回来 -> 直接渲染
总耗时 = max(Bundle, 网络) + 渲染 = 400ms

点击预请求实现（Native侧）：
func onItemClick(itemId) {
    MRNPreFetch.start(itemId)      // 立即发BFF请求
    MRNNavigator.push("detail")    // 同时打开页面
}

JS侧取数据：
useEffect(() => {
    const preData = await MRNPreFetch.getData(itemId);
    if (preData) {
        setModuleData(preData);  // 直接用，省去网络等待
    } else {
        const data = await fetchBFF(itemId);  // fallback
        setModuleData(data);
    }
}, []);

Bundle预加载配合：
// 列表页滑动空闲时预加载详情Bundle
InteractionManager.runAfterInteractions(() => {
    MRNBundleLoader.preload('detail-bundle');
});
// 这样点击时Bundle已在内存，容器秒开

时间节省：Bundle预加载省200-400ms + 预请求并行省150-300ms`,
  },
  {
    id: 3008,
    category: '一面追问',
    difficulty: 'medium',
    question: '模块优先级渲染是怎么实现的？首屏和非首屏的加载策略有什么区别？',
    answer: `优先级划分：
P0（首屏关键）：头图、价格条、SKU摘要、BottomBar
P1（首屏辅助）：评分、亮点标签、门店摘要
P2（非首屏）：评价、问答、服务设施
P3（懒加载）：相关推荐、底部内容

实现方式：
function DetailPage({ moduleList, response }) {
    const [maxPriority, setMaxPriority] = useState(0);

    useEffect(() => {
        // P0 立即渲染，P1 在首屏完成后
        InteractionManager.runAfterInteractions(() => {
            setMaxPriority(1);
            setTimeout(() => setMaxPriority(2), 100);
        });
    }, []);

    return moduleList.map(mod => {
        if (mod.priority > maxPriority) {
            return <Placeholder height={mod.estimatedHeight} />;
        }
        const Comp = registry[mod.moduleKey];
        return <Comp data={response[mod.moduleKey]} />;
    });
}

配合虚拟化：
- 用 FlatList 代替 ScrollView，超出视口的模块不创建 View
- 首屏只渲染 4-5 个模块而非全部 20+
- JS 执行时间减少 60%+`,
  },
  {
    id: 3009,
    category: '一面追问',
    difficulty: 'medium',
    question: 'SPU/SKU 数据残留问题是什么场景？你怎么解决的？',
    answer: `场景：用户选了SKU -> 返回列表 -> 点另一个商品 -> 页面短暂显示上一个商品的SKU数据

原因：
1. RN 页面栈可能复用组件实例
2. MobX store 是单例，页面切换时未重置
3. 异步请求返回前旧数据还在 store

解决方案：
1. Store 重置：
useEffect(() => {
    skuStore.reset();
    priceStore.reset();
    return () => { skuStore.reset(); };
}, [itemId]);

2. 请求结果校验：
const fetchData = async (id) => {
    const data = await api.getDetail(id);
    if (id !== currentItemId) return; // 已切换，丢弃
    store.setData(data);
};

3. 组件 key 绑定 ID：
<DetailModule key={itemId} />  // 强制卸载重建

4. Timer/Observer 清理：
useEffect(() => {
    const timer = setInterval(checkStock, 5000);
    return () => clearInterval(timer);
}, []);

规范：所有 store 必须实现 reset()，CR 必检异步回调是否校验上下文。`,
  },
  {
    id: 3010,
    category: '一面追问',
    difficulty: 'medium',
    question: 'MRN 多 Bundle 架构是怎么设计的？Bundle 之间怎么共享依赖？',
    answer: `拆分策略：
1. Common Bundle（基础包 2-3MB）：
   React/RN 框架 + 公共组件 + 工具函数 + 网络层
   随 App 发版，不频繁更新

2. Business Bundle（业务包 1-2MB/页面）：
   各页面业务代码，按页面拆分
   支持独立热更新

加载流程：
App启动 -> 加载Common Bundle -> 用户进入页面 -> 按需加载Business Bundle

依赖共享：
// metro 构建配置
// Common Bundle 中的模块用固定 moduleId
// Business Bundle 引用时用相同 ID，不重复打包
// 运行时通过全局 require 从 Common Bundle 取模块

版本管理：
- Business Bundle 声明最低 Common Bundle 版本
- 构建时检测重复打包的模块并告警
- lockfile 锁定依赖版本

效果：
- 热更新包从 5MB -> 200KB-500KB
- 支持按页面粒度灰度
- 团队可并行开发不同页面 Bundle`,
  },
  {
    id: 3011,
    category: '一面追问',
    difficulty: 'medium',
    question: '小程序 Skyline 中视频+图集多 Tab 的手势冲突怎么处理的？',
    answer: `问题：
详情页头图区域 [视频|图集] 两个Tab可左右滑动切换。
Skyline 中页面纵向滚动和 Swiper 横向滑动会互相抢夺手势。

与 MRN 的差异：
- MRN: Gesture Handler 统一管理，自动协调方向
- Skyline: 事件系统不同，需手动处理冲突

解决方案：
1. 手势方向判断：
onTouchStart -> 记录起点
onTouchMove -> 计算 dx 和 dy
  if (|dx| > |dy|) 横滑 -> catch阻止冒泡，交给Swiper
  if (|dy| > |dx|) 纵滑 -> 不阻止，交给页面滚动

2. 视频层级处理：
- Skyline 中 video 是原生组件，层级默认最高
- 切换到图集Tab时条件渲染销毁video（而非display:none）
- wx:if 而非 hidden

3. Tab 动画：
- 用 Skyline worklet 实现下划线跟手动画
- shared value 传递滑动进度

4. TabCapsule 布局：
- absolute 定位 + z-index 控制
- pointer-events 控制点击穿透区域`,
  },
  {
    id: 3012,
    category: '一面追问',
    difficulty: 'medium',
    question: '前端埋点怎么实现？什么是「有效曝光」？你提到曝光时机异常是什么问题？',
    answer: `曝光埋点实现：
Web: IntersectionObserver 监听元素进入视口
RN: onLayout获取位置 + ScrollView.onScroll 计算可见性

有效曝光标准（美团规范）：
1. 面积 >= 50% 进入可视区域
2. 停留 >= 500ms（防快速滑过）
3. 同一页面生命周期只报一次
4. 数据必须完整（moduleKey、itemId）

曝光时机异常的问题：
1. 过早曝光：数据未到就曝光了loading态
   修复：数据加载+渲染完成后才启动监听

2. MRNBox快照曝光：快照阶段不该算曝光
   修复：标记快照态，真实渲染后才上报

3. 折叠内容曝光：购买须知折叠态不应曝光内部
   修复：判断父容器展开状态

4. 页面切换残留：页面已切走但timer还在跑
   修复：useEffect return 清理observer

5. 重复曝光：TabBar切换回来重复触发
   修复：维护已曝光Set去重`,
  },
  {
    id: 3013,
    category: '一面追问',
    difficulty: 'medium',
    question: 'RN 中图片加载优化手段有哪些？你说的图片染色和优先级是什么？',
    answer: `图片优化策略：

1. 优先级队列：
首屏图片 priority:'high'，并发加载
非首屏 priority:'low'，排队等待
Native图片库（SDWebImage/Glide）支持优先级调度

2. 图片染色（tintColor）：
一张白色图标 + tintColor 复用多种颜色
减少图片资源数量，减小包体积
<Image source={icon} style={{ tintColor: '#6366f1' }} />

3. CDN 裁剪 + WebP：
const url = originUrl + '?w=' + (width*pixelRatio) + '&format=webp';
减少带宽 60-80%

4. 渐进式加载：
先加载 1KB 模糊缩略图，再加载高清图
用户感知更快

5. 预加载：
Image.prefetch(nextPageImageUrl);
列表页提前加载详情页首图

6. 高斯模糊分端处理：
iOS: 原生 blurView，性能好
Android: 低端机降级为半透明遮罩
小程序: 用预处理模糊图替代

效果：首屏图片加载快40%，带宽节省65%`,
  },
  {
    id: 3014,
    category: '一面追问',
    difficulty: 'medium',
    question: 'RN 中接入原生模块（如高德地图）的完整流程是什么？JS 怎么调用 Native 能力？',
    answer: `原生模块接入流程：

1. Native 侧实现模块：
// iOS (Swift/ObjC)
@objc(AMapLocation)
class AMapLocation: RCTEventEmitter {
    @objc func startLocation(_ resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        AMapLocationManager.requestLocation { location in
            resolve(["lat": location.latitude, "lng": location.longitude])
        }
    }
}

// Android (Kotlin/Java)
class AMapLocationModule(reactContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "AMapLocation"
    @ReactMethod
    fun startLocation(promise: Promise) { ... }
}

2. 注册到 RN：
// iOS: 在 Bridge 模块注册表中声明
// Android: 在 ReactPackage 中添加

3. JS 侧调用：
import { NativeModules } from 'react-native';
const { AMapLocation } = NativeModules;
const location = await AMapLocation.startLocation();

4. 事件监听（持续定位）：
import { NativeEventEmitter } from 'react-native';
const emitter = new NativeEventEmitter(AMapLocation);
emitter.addListener('onLocationChange', (data) => { ... });

建盛材实践：
- 单据位置采集：开单时获取经纬度附加到订单
- 员工打卡签到：结合地理围栏判断是否在店
- 地图展示：直接用 react-native-maps 封装`,
  },
  {
    id: 3015,
    category: '一面追问',
    difficulty: 'medium',
    question: '你提到 AI 营销助手生成文案并一键发布到小红书，这个功能的技术实现是怎样的？',
    answer: `AI营销助手技术实现：

整体架构：
用户输入关键词 -> 后端调用大模型生成文案 -> 前端展示/编辑 -> 发布到平台

1. 文案生成：
- 前端传入：关键词、行业、目标平台、语气风格
- 后端调 LLM API（Prompt 模板 + 用户输入）
- 流式返回（SSE/WebSocket），前端逐字展示

2. 多平台适配：
- 小红书：标题+正文+标签格式，字数限制
- 公众号：HTML富文本格式
- 朋友圈：纯文本+图片描述
- 短视频脚本：分镜头+台词+画面描述

3. 一键发布实现：
方案A（小红书）：通过 DeepLink 唤起小红书 App，预填内容
方案B（公众号）：调用公众号 API 创建草稿
方案C（朋友圈）：复制到剪贴板 + 引导用户粘贴

4. 前端实现细节：
- 流式文案展示：EventSource 接收 SSE
- 富文本编辑：支持用户修改 AI 生成的内容
- 历史记录：本地+云端保存生成历史
- 模板管理：常用 Prompt 模板收藏

效果：
- 客户活跃度提高 30%
- 从想文案到发布：原来30min -> 现在3min`,
  },
  {
    id: 3016,
    category: '一面追问',
    difficulty: 'medium',
    question: '你提到系统埋点做用户行为分析，前端埋点体系是怎么设计的？怎么做到不侵入业务代码？',
    answer: `埋点体系设计：

分层架构：
1. 数据采集层：负责收集原始事件
2. 数据处理层：格式化、补充公参、去重
3. 数据上报层：批量上报、重试、离线缓存

不侵入业务的方案：

1. 声明式埋点（推荐）：
// 通过配置而非代码
<View data-track-exposure="module_sku" data-track-click="btn_buy">
    <Button />
</View>
// HOC 自动处理曝光和点击上报

2. AOP 方式：
// 统一拦截路由跳转 -> 自动 PV 埋点
// 统一拦截按钮点击 -> 自动点击埋点

3. 自动化埋点 SDK：
const TrackView = ({ trackId, children }) => {
    const ref = useRef();
    useExposure(ref, trackId); // 自动处理曝光
    return <View ref={ref} onPress={() => reportClick(trackId)}>
        {children}
    </View>;
};

公参自动补充：
- 设备信息（机型、系统版本、网络类型）
- 用户信息（userId、ABTest分组）
- 页面信息（pageId、referrer）
- 时间戳、sessionId

上报策略：
- 实时上报：关键转化事件（下单、支付）
- 批量上报：普通事件攒 10 条或 5s 上报一次
- 离线缓存：无网时存本地，恢复后补报

建盛材实践：
- 通过行为数据精准定位用户画像
- 配合 APP 广告精准引导，销售成单率提高 20%`,
  },
  {
    id: 3017,
    category: '一面追问',
    difficulty: 'medium',
    question: 'React 中 useMemo 和 useCallback 的区别？什么时候该用什么时候不该用？',
    answer: `useMemo：缓存计算结果
useCallback：缓存函数引用

const memoValue = useMemo(() => expensiveCalc(a, b), [a, b]);
const memoFn = useCallback((x) => doSomething(x, a), [a]);
// useCallback(fn, deps) 等价于 useMemo(() => fn, deps)

该用的场景：
1. 昂贵计算：数据过滤/排序/格式化大列表
2. 引用稳定性：传给 React.memo 子组件的 props
3. 依赖项：作为其他 Hook 的依赖

不该用的场景：
1. 简单计算：const x = a + b（优化收益 < 缓存开销）
2. 不传给子组件的函数
3. 每次渲染都会变化的依赖

过度使用的代价：
- 额外的内存占用（缓存值+依赖数组）
- 代码可读性下降
- GC 压力（旧缓存需要回收）

项目实践：
// MRN 模块中，模块数据格式化用 useMemo
const formattedPrice = useMemo(() => formatPrice(rawPrice, currency), [rawPrice, currency]);

// 传给子组件的回调用 useCallback
const handleSkuChange = useCallback((skuId) => {
    store.selectSku(skuId);
}, []);`,
  },
  {
    id: 3018,
    category: '一面追问',
    difficulty: 'medium',
    question: '你提到使用了 Zustand 状态管理，它和 MobX/Redux 有什么区别？为什么红包项目选了 Zustand？',
    answer: `Zustand 特点：
- 极简 API：create 一个 store 即可
- 无 Provider：不需要 Context 包裹
- 不可变更新：类似 Redux 但更简洁
- 体积极小：~1KB
- 支持中间件：persist、devtools、immer

对比：
| 维度 | Zustand | MobX | Redux |
|------|---------|------|-------|
| 包大小 | ~1KB | ~15KB | ~7KB+中间件 |
| 样板代码 | 极少 | 少 | 多 |
| 学习曲线 | 低 | 中 | 高 |
| 响应式 | 手动 selector | 自动追踪 | 手动 selector |
| DevTools | 支持 | 有限 | 完善 |
| 适合场景 | 中小型项目 | 中大型/RN | 大型复杂项目 |

红包项目选 Zustand 的原因：
1. H5 营销页面，体积敏感（加载速度直接影响转化）
2. 状态逻辑不复杂（红包状态、用户积分、活动配置）
3. 团队上手快，无需理解 Observable/Proxy 概念
4. 无 Provider 包裹，多入口 H5 页面更方便
5. 内置 persist 中间件对接 localStorage

示例：
const useStore = create((set) => ({
    balance: 0,
    addBalance: (amount) => set((s) => ({ balance: s.balance + amount })),
}));`,
  },
  {
    id: 3019,
    category: '一面追问',
    difficulty: 'medium',
    question: '你用 Vite 构建项目，Vite 为什么比 Webpack 快？它的原理是什么？',
    answer: `Vite 快的核心原因：

开发环境（Dev Server）：
1. 不打包！利用浏览器原生 ESM import
   - Webpack: 启动时打包所有文件 -> 慢
   - Vite: 按需编译，浏览器请求哪个文件才编译哪个

2. 依赖预构建（esbuild）：
   - node_modules 用 esbuild 预构建（Go 写的，极快）
   - 将 CJS 转 ESM + 合并小文件减少请求数
   - 结果缓存，只做一次

3. HMR 精确更新：
   - 只更新修改的模块，不重新打包整个 bundle
   - 通过 import.meta.hot 精确失效

生产环境（Build）：
- 用 Rollup 打包（tree-shaking 更好）
- 代码分割、资源优化和 Webpack 类似

对比数字：
- 冷启动：Vite ~300ms vs Webpack ~10s（中型项目）
- HMR：Vite ~50ms vs Webpack ~2s

项目中的选择：
- 建盛材 PC 后台：Vite（新项目，追求开发体验）
- 红包营销系统：Vite（H5 项目，构建简单）
- MRN 项目：Metro bundler（RN 专用，非 Vite/Webpack）`,
  },
  {
    id: 3024,
    category: '一面追问',
    difficulty: 'medium',
    question: '你提到使用了 Zustand 做状态管理，Zustand 和 MobX、Redux 三者各适合什么场景？',
    answer: `三者对比：

Zustand（红包营销系统使用）：
- 极简 API：create + get/set
- 无 Provider 包裹，任意组件直接引用
- 天然支持异步，不需要中间件
- 体积极小（~1KB）
- 适合：中小型项目、追求简洁

const useStore = create((set) => ({
    count: 0,
    increment: () => set(s => ({ count: s.count + 1 })),
    fetchData: async () => {
        const data = await api.get();
        set({ data });
    }
}));

MobX（美团 MRN / 建盛材使用）：
- 响应式 + OOP 风格
- 自动依赖追踪，精确更新
- 适合：模块化 store、SDUI 模式
- class Store + observable + action

Redux（大型复杂项目）：
- 函数式 + 不可变数据
- 严格单向数据流，可预测
- 中间件生态丰富（saga/thunk）
- 适合：需要严格状态追踪、时间旅行调试

选型建议：
- 简单状态 → Zustand
- 模块化/RN → MobX
- 超大型/需要严格规范 → Redux Toolkit
- 服务端状态 → React Query / SWR（不是全局状态库）`,
  },
  {
    id: 3025,
    category: '一面追问',
    difficulty: 'medium',
    question: '请解释 React 的 useCallback 和 useMemo 的区别？什么时候该用什么时候不该用？',
    answer: `核心区别：
- useMemo：缓存计算结果（值）
- useCallback：缓存函数引用（函数）

// useMemo: 避免重复计算
const filtered = useMemo(() => {
    return items.filter(i => i.price > threshold);
}, [items, threshold]);

// useCallback: 避免子组件因函数引用变化重渲染
const handleClick = useCallback((id) => {
    navigation.push('detail', { id });
}, [navigation]);

该用的场景：
1. 传给 React.memo 包裹的子组件的 props
2. 作为其他 Hook 的依赖项
3. 计算量确实大的派生数据
4. 列表项的事件处理器（避免每次 render 新建）

不该用的场景：
1. 简单计算（a + b），缓存的开销 > 重新计算
2. 没传给子组件的内部函数
3. 组件本身很轻量，重渲染无所谓
4. 依赖项频繁变化，缓存总是失效

项目实践：
在 MRN 模块中：
- 模块 data transform 用 useMemo（避免每次 render 重新解析）
- 传给 FlatList renderItem 的处理函数用 useCallback
- BottomBar 按钮点击用 useCallback（传给 memo 子组件）

常见误区：
- 不是所有函数都需要 useCallback
- 过度使用反而增加内存和 GC 压力
- 先写正确代码，有性能问题再优化`,
  },
  {
    id: 3026,
    category: '一面追问',
    difficulty: 'medium',
    question: 'RN 中列表性能优化有哪些手段？FlatList 的 key 和 keyExtractor 为什么重要？',
    answer: `FlatList 性能优化手段：

1. keyExtractor（最重要）：
// 为每个 item 提供稳定唯一 key
keyExtractor={(item) => item.id.toString()}
// 错误用法：用 index 做 key（删除/排序时 UI 错乱）

为什么重要：
- React 用 key 判断哪些 item 是新增/删除/移动的
- 错误的 key 导致：组件错误复用、状态串扰、多余渲染

2. getItemLayout（避免动态测量）：
getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
})}
// 跳过 onLayout 测量，直接计算位置
// 前提：所有 item 等高

3. windowSize 调整：
// 默认 21（前后各渲染 10 屏）
// 减小可降低内存，但滚动快时可能白屏
windowSize={5}

4. maxToRenderPerBatch：
// 每批渲染的 item 数量
maxToRenderPerBatch={10}  // 默认

5. removeClippedSubviews：
// Android 有效，iOS 效果有限
removeClippedSubviews={true}
// 移出视口的 View 从 Native 层级移除

6. renderItem 优化：
// 用 React.memo 包裹 item 组件
const MemoItem = React.memo(ListItem);
// 配合 useCallback 的 onPress

7. 避免内联函数/对象：
// 错误：每次 render 新建对象
<FlatList style={{ flex: 1 }} />
// 正确：提取到外部
const style = { flex: 1 };

8. 分页加载：
onEndReached={loadMore}
onEndReachedThreshold={0.5}`,
  },
  {
    id: 3027,
    category: '一面追问',
    difficulty: 'medium',
    question: 'HTTP 缓存机制有哪些？强缓存和协商缓存的区别？在你的项目中 BFF 接口是如何做缓存的？',
    answer: `HTTP 缓存分为强缓存和协商缓存：

强缓存（不发请求）：
- Cache-Control: max-age=3600（优先级高）
- Expires: Thu, 01 Dec 2025 16:00:00 GMT（绝对时间，不推荐）
- 命中时状态码 200（from cache）

协商缓存（发请求验证）：
- Last-Modified / If-Modified-Since（秒级精度）
- ETag / If-None-Match（内容哈希，精确）
- 命中时状态码 304 Not Modified

流程：
请求 → 检查强缓存 → 未过期直接用 → 过期则协商验证 → 未变返回 304 → 变了返回 200 + 新数据

BFF 接口缓存策略（美团项目）：

1. 客户端缓存（firstScreenBffCache）：
   - 首屏数据缓存到本地存储
   - 下次秒开，后台更新

2. BFF 服务端缓存：
   - 热门商品数据 Redis 缓存（TTL 60s）
   - 降低后端微服务压力

3. CDN 缓存（静态资源）：
   - 图片/JS/CSS 强缓存 1 年
   - 文件名带 hash，更新即失效

4. 接口不缓存的场景：
   - 价格、库存（实时性要求高）
   - 用户个性化数据
   - 交易相关接口

注意：
- 移动端网络不稳定，缓存策略更激进
- 但要确保数据新鲜度（SWR 模式）`,
  },
  {
    id: 3020,
    category: '一面追问',
    difficulty: 'hard',
    question: '你提到桥优化（Bridge 优化），具体做了哪些？JS-Native 通信的瓶颈在哪里？',
    answer: `Bridge 通信瓶颈分析：

瓶颈来源：
1. 序列化开销：每次通信都要 JSON.stringify + JSON.parse
2. 异步队列：消息排队处理，有延迟
3. 批量传输上限：单次消息过大会阻塞队列
4. 高频通信：动画/手势每帧都要跨 Bridge，导致掉帧

优化手段：

1. 减少通信次数：
// 错误：循环中逐个调用 Native
for (const item of list) {
    NativeModule.process(item); // N 次跨 Bridge
}
// 正确：批量传递
NativeModule.batchProcess(list); // 1 次跨 Bridge

2. 数据精简：
// 错误：传递完整对象
NativeModule.setData(fullResponse); // 可能几十 KB
// 正确：只传必要字段
NativeModule.setData({ id, title, price });

3. 使用 JSI 替代 Bridge：
// 新架构下，直接 C++ 调用，无序列化
// 特别是 Animated 使用 Reanimated 2+（worklet 在 UI 线程执行）

4. 减少不必要的 re-render：
// 每次 re-render 都可能触发 Native View 更新
// 用 React.memo + shouldComponentUpdate 减少

5. 图片加载并发控制：
// 限制同时加载的图片数量
// 避免大量图片请求堆积在 Bridge 队列

6. setNativeProps（绕过 re-render）：
// 直接修改 Native View 属性，不走 React 渲染
ref.current.setNativeProps({ style: { opacity: 0.5 } });
// 适合高频动画场景

项目中的实际优化：
- 首屏模块批量传递初始数据（1 次代替 20+ 次）
- 埋点数据本地缓存，批量上报（1 分钟一次）
- 图片加载队列化，首屏优先
- 效果：Bridge 消息数减少 70%，首屏通信耗时减少 45%`,
  },
  {
    id: 3021,
    category: '一面追问',
    difficulty: 'hard',
    question: '请详细描述一个你实际处理过的线上 Bug 的完整排查过程？从发现到修复到复盘。',
    answer: `真实案例：SKU 切换后价格显示错误

发现：
- 线上监控报警：价格模块 JS Error 数量飙升
- 用户反馈：切换 SKU 后价格没变 / 显示 NaN
- 影响面：约 5% 用户（特定 SKU 组合）

排查过程：

1. 看监控数据：
   - 错误信息：Cannot read property 'price' of undefined
   - 堆栈定位到 priceBar 模块的 render 方法
   - 设备分布：Android 偏多

2. 复现路径：
   - 商品有多个 SKU（如：单人/双人/家庭套餐）
   - 快速连续切换 SKU → 触发
   - 慢速切换无法复现

3. 定位根因：
   - SKU 切换触发 BFF 重新请求
   - 快速切换时，上一次请求的响应「晚于」最新请求
   - 竞态条件：旧数据覆盖了新数据
   // 时序：
   // 点击 SKU-A → 请求 A → 点击 SKU-B → 请求 B
   // 响应 B 先回来 → 渲染正确价格
   // 响应 A 后回来 → 覆盖为 SKU-A 的价格（但 UI 显示 SKU-B 选中）

4. 修复方案：
   // 请求时带版本号/请求 ID
   const requestId = ++currentRequestId;
   const data = await fetchPrice(skuId);
   if (requestId !== currentRequestId) return; // 过期请求，丢弃
   setPriceData(data);

5. 验证：
   - 本地模拟慢网络 + 快速切换，确认不再复现
   - 灰度 5% → 20% → 100%
   - 监控 Error 降为 0

6. 复盘：
   - 根因：异步竞态未处理
   - 改进：所有 SKU 相关请求统一加竞态保护
   - 规范：CR checklist 新增「异步请求竞态检查」`,
  },
  {
    id: 3022,
    category: '一面追问',
    difficulty: 'hard',
    question: '在 MRN 中如何做内存泄漏检测和优化？你遇到过哪些内存泄漏场景？',
    answer: `RN 内存泄漏检测与优化：

检测工具：
1. Xcode Instruments（iOS）：
   - Allocations: 查看对象创建和释放
   - Leaks: 自动检测循环引用

2. Android Studio Profiler：
   - Memory Profiler: 实时内存曲线
   - Heap Dump: 查看对象引用链

3. JS 侧：
   - Chrome DevTools Memory（调试模式）
   - 手动对比 snapshot（mount 前后）

常见内存泄漏场景：

1. 未清理的定时器/监听器：
useEffect(() => {
    const timer = setInterval(checkStatus, 5000);
    const sub = eventBus.on('update', handler);
    // 忘记 return cleanup!
    return () => {
        clearInterval(timer);
        sub.remove();
    };
}, []);

2. 闭包引用过期数据：
// handler 闭包持有整个组件作用域
// 组件卸载后，如果 handler 没被移除，整个组件内存无法回收

3. 全局 Store 无限增长：
// 每次进入页面往全局 store push 数据
// 从不清理
store.visitHistory.push(newData); // 内存持续增长

4. 图片缓存过大：
// 大量高清图缓存在内存中
// 需要设置内存缓存上限和 LRU 淘汰

5. Native 模块未释放：
// 创建了 Native 动画/手势对象
// 页面卸载时未调用 destroy/release

项目中的实践：
- 所有 observer/timer 必须在 useEffect return 中清理
- Store 数据绑定页面生命周期，离开时 reset
- 图片内存缓存限制 100MB
- 长列表使用 FlatList（自动回收）
- 定期跑 Instruments 检查，作为发版门禁`,
  },
  {
    id: 3023,
    category: '一面追问',
    difficulty: 'hard',
    question: 'RN 动画有哪些实现方式？Animated API 和 Reanimated 的区别是什么？哪些场景必须用 Reanimated？',
    answer: `RN 动画方案对比：

1. Animated API（官方）：
// 在 JS 线程计算动画值
const opacity = useRef(new Animated.Value(0)).current;
Animated.timing(opacity, {
    toValue: 1,
    duration: 300,
    useNativeDriver: true, // 关键：部分属性可走 Native 线程
}).start();

局限：
- useNativeDriver: true 只支持 transform 和 opacity
- 布局属性（width/height/margin）只能在 JS 线程计算
- JS 线程繁忙时动画卡顿

2. Reanimated 2+（社区方案，美团在用）：
// 动画逻辑编译为 worklet，在 UI 线程执行
const translateX = useSharedValue(0);
const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
}));
// 手势驱动
const gesture = Gesture.Pan().onUpdate((e) => {
    translateX.value = e.translationX; // UI 线程直接执行！
});

优势：
- 全部在 UI 线程执行，不受 JS 线程阻塞
- 支持所有样式属性动画
- 手势跟手动画丝滑 60fps
- 支持弹性、衰减等物理动画

3. LayoutAnimation（简单布局动画）：
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
setState(newState);
// 下次 layout 变化自动动画

必须用 Reanimated 的场景：
- 手势跟手动画（拖拽、下拉刷新自定义）
- JS 线程繁忙时的动画（列表滚动 + 头部缩放）
- 复杂交互动画（侧滑删除、卡片翻转）
- 需要动画中实时响应的场景

项目实践：
- 详情页头图下拉放大：Reanimated
- BottomBar 弹出动画：Animated（简单 translateY）
- SKU 面板展开：LayoutAnimation（简单场景够用）`,
  },
];