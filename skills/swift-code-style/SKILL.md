---
name: swift-code-style
description: 编写、修改、重构或审查 Swift 代码时应用精简的 code-is-poetic 规范，约束命名、格式、API、安全解包与引用管理。
license: MIT
---

# Swift 代码规范

来源：[Swift-Developers/code-is-poetic](https://github.com/Swift-Developers/code-is-poetic)。以下已合并重复规则、修正旧语法；无需每次读取原文。
设计公开 API 或遇到命名歧义时，按需参考 [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/)，不默认读取全文。
用户明确要求及项目既有规范优先；仅约束本次涉及的 Swift 代码，不顺带重排无关代码。使用项目支持的 Swift 版本；清晰优先于简短。

## 命名与 API

- 类型用 `UpperCamelCase`；函数、变量、属性、枚举成员用 `lowerCamelCase`。不加项目名前缀，不用含糊缩写或单字母；通用缩写保持整体大小写，如 `URLRouter`、`urlString`。
- Bool 用 `is` 前缀；集合用复数，不加 `Array/List` 后缀。名称不能体现类型时补类型后缀，如 `coverImageView`；能体现时不重复，如 `firstName`。
- API 设计应引导正确使用，减少误用机会。从调用处检查可读性：删去与类型或参数重复的词；首参数构成动词宾语时省略标签（`addSubview(view)`），构成介词短语时用介词标签（`removeBoxes(having:)`），否则保留（`dismiss(animated:)`）。其余参数通常保留标签；独立并列短语把介词放进方法名（`moveTo(x:y:)`）；冗余标签可省略。
- 保值转换可省略构造参数标签；可能丢失信息的转换必须用标签说明策略，如 `truncating:`。枚举成员不重复类型前缀。
- 协议：角色用名词，能力用 `able/ing`；与已有类对应的协议用 `Protocol` 后缀，委托用 `Delegate`。

## 类型与组织

- 优先 `struct`；需要引用语义、继承等类特性才用 `class`。不供继承的类标 `final`；只允许模块内继承用 `public`，确需模块外继承才用 `open`。
- 优先 `let`；需修改才用 `var`。结构体属性可保留可变性，由实例的 `let/var` 控制；需要时使用 `mutating`，不强求创建新值。
- 显然的类型用推断及 `.case`；歧义、契约处显式标注。数组/字典类型统一写 `[Element]`、`[Key: Value]`；空集合显式标注，如 `var names: [String] = []`、`var lookup: [String: Int] = [:]`。
- 避免不必要的全局变量、常量、函数；放入相关类型或命名空间。适合时扩展已有类型/协议；真实重复代码才提取共享函数或协议扩展。
- 无需重写的协议实现优先分离到 `extension Type: Protocol`。按功能/协议用 `// MARK: -` 分组；系统 API、公开 API 通常在前，不强制顺序。
- 访问权限取满足需求的最低级别：`private` → `fileprivate` → 默认 `internal` → `public` → `open`。`@…` 标记在前，通常单独一行；访问修饰符在其余修饰符前。
- 为函数写有效的 `///` 文档，尤其泛型函数；说明用途及有意义的参数、返回值、错误，不留占位符。允许忽略返回值的 API 标 `@discardableResult`；有系统版本限制的 API 标正确平台的 `@available`。

## 控制流与安全

- 用 `guard` 提前退出，保持主路径平直；可选值用 `if let/guard let`，同一条件下多个绑定合并。禁止先判非 nil 再强解包；避免 `!` 和隐式解包，禁止 `as!`、`try!`。用 `as?`、`do/catch`；仅允许忽略错误时用 `try?`。
- 空集合/字符串用 `isEmpty`；可选值判空用 `== nil/!= nil` 或绑定，不假设存在非标准的 `isNone/isSome`。
- 取首尾用 `first/last`；遍历优先 `for item in items`，需要索引才用 `indices/enumerated()`。`map/reduce/forEach` 仅在更清晰时使用，不强求高阶函数；简单闭包可用 `$0`、运算符函数。
- 内容相等用 `==/!=`，自定义类型按语义实现 `Equatable`；类实例身份用 `===/!==`。
- 只有一个闭包参数且位于最后时优先尾随闭包；条件语句后紧接 `{` 或多个闭包参数时保留括号及标签。
- 非必要不写 `self.`；同名消歧或编译器要求时保留。闭包检查捕获和生命周期：可能形成循环引用时用 `[weak self]`，需连续操作时先 `guard let self = self else { return }`；不盲用 `unowned`。委托/数据源属性优先用 `weak`，自定义协议以 `AnyObject` 限定；确需强持有时依据所有权设计。
- 已需单例时用 `static let shared = Type()`；不主动引入单例。

## 格式与交付

- 4 空格缩进；二元运算符及 `->` 两侧空格；逗号、冒号后一个空格，冒号前不加；不写行尾分号。
- 左大括号同行，`} else {` 同行；条件无多余括号。方法/逻辑块用空行分隔；推荐 `extension` 开头留一空行；推荐 `switch` 的 case 块及 `if/else` 分支末尾空行，最后一块不留。
- `//` 后加空格；行尾注释前也加空格。
- 交付前检查上述规则及可选值/错误/捕获安全；使用项目已有构建或检查验证本次改动。未执行时说明，不为格式规则额外引入依赖。
