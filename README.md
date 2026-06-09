# Proxy Configs

> A personal collection of Shadowrocket configurations — rule sets, rewrite modules, scripts, and DNS settings.
>
> 个人维护的 Shadowrocket 配置集合，包含分流规则、重写模块、脚本和 DNS 配置。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> [!WARNING]
> 本仓库仅供个人学习、研究网络技术与提升上网体验之用。请遵守所在国家和地区的法律法规，**请勿用于任何非法用途**。使用本仓库内容所产生的一切后果由使用者自行承担。
>
> This repository is for personal learning and research purposes only. Please comply with the laws and regulations of your country/region. The author is not responsible for any misuse.

## 目录 Contents

- [仓库结构 Repository Structure](#仓库结构-repository-structure)
- [使用方法 Usage](#使用方法-usage)
  - [开启 MITM 与安装证书 MITM & Certificate](#开启-mitm-与安装证书-mitm--certificate)
  - [重写模块 Modules](#重写模块-modules)
  - [分流规则 Rules](#分流规则-rules)
  - [脚本 Scripts](#脚本-scripts)
  - [DNS 配置 DNS](#dns-配置-dns)
- [可用模块 Available Modules](#可用模块-available-modules)
- [更新 Updating](#更新-updating)
- [鸣谢 Acknowledgements](#鸣谢-acknowledgements)
- [许可证 License](#许可证-license)

## 仓库结构 Repository Structure

```text
proxy-configs/
├── rules/              # 分流规则 Rule sets
│   ├── direct/         #   直连规则 Direct
│   ├── proxy/          #   代理规则 Proxy
│   ├── reject/         #   广告拦截 Reject / ad-blocking
│   └── apps/           #   常见应用分流 Per-app
├── modules/            # 重写模块 Shadowrocket modules (.sgmodule)
│   └── youtube_adblock.sgmodule
├── scripts/            # JavaScript 脚本 Scripts (.js)
├── dns/                # DNS 配置 DNS configuration
├── config/             # 完整配置模板 Full config templates
└── README.md
```

> 说明：以上为推荐的组织方式，目录会随内容补充逐步建立。
> Note: directories will be populated as content grows.

## 使用方法 Usage

> 将下文 `<RAW_BASE>` 替换为本仓库的 raw 前缀：
> Replace `<RAW_BASE>` below with this repo's raw URL prefix:
>
> ```text
> https://raw.githubusercontent.com/akiralereal/proxy-configs/main
> ```
>
> 国内访问建议使用加速镜像（如 jsDelivr `https://cdn.jsdelivr.net/gh/akiralereal/proxy-configs@main`）。
> For users in mainland China, a CDN mirror (jsDelivr) is recommended for reliability.

### 开启 MITM 与安装证书 MITM & Certificate

带脚本 / 重写的模块需要解密 HTTPS 流量，**必须先安装并信任 Shadowrocket 的 CA 证书，否则脚本不会生效**：

1. Shadowrocket → **证书** → 生成新的 CA 证书
2. iOS `设置 → 通用 → VPN与设备管理` → 安装该描述文件
3. iOS `设置 → 通用 → 关于本机 → 证书信任设置` → **手动打开信任开关**

> Scripts/rewrites require MITM. You **must install and trust** Shadowrocket's CA certificate first, or scripts will not run.

### 重写模块 Modules

`配置 → 模块（Modules）→ 添加模块`，填入模块的 `.sgmodule` 链接，例如：

```text
<RAW_BASE>/modules/youtube_adblock.sgmodule
```

### 分流规则 Rules

在 `规则（Rule）` 中以远程规则集（Rule Set）方式引用：

```ini
[Rule]
RULE-SET,<RAW_BASE>/rules/reject/reject.list,REJECT
RULE-SET,<RAW_BASE>/rules/proxy/proxy.list,PROXY
RULE-SET,<RAW_BASE>/rules/direct/direct.list,DIRECT
```

### 脚本 Scripts

脚本通常由重写模块自动引用，无需手动安装。如需直接引用（在模块的 `[Script]` 段）：

```ini
[Script]
example = type=http-response,pattern=^https?://example\.com/api,script-path=<RAW_BASE>/scripts/example.js,requires-body=1
```

### DNS 配置 DNS

`dns/` 目录提供推荐的 DNS / DoH 配置片段，可复制到 Shadowrocket 配置的 DNS 设置中。

> ⚠️ 本仓库**不提供任何代理节点或机场订阅**，仅提供规则与配置。节点需自行准备。
> This repo does **not** provide any proxy nodes/servers — bring your own.

## 可用模块 Available Modules

| 模块 Module | 说明 Description | 链接 URL |
| ----------- | ---------------- | -------- |
| YouTube 去广告增强 | 去广告 / 后台播放 / 画中画(PIP) | `<RAW_BASE>/modules/youtube_adblock.sgmodule` |

> YouTube 模块基于 [Maasea](https://github.com/Maasea/sgmodule) 的开源模块整理为个人配置，核心脚本版权归原作者所有，经原始链接引用。
> The YouTube module is adapted from [Maasea](https://github.com/Maasea/sgmodule)'s open-source work; the core script remains referenced from the original author and is credited accordingly.

## 更新 Updating

规则与模块通过远程链接引用，Shadowrocket 会按设定的间隔自动更新；也可在客户端中手动「更新」。

Rules and modules are referenced remotely and refresh automatically, or can be updated manually.

## 鸣谢 Acknowledgements

部分规则与脚本思路参考自社区开源项目，已在对应文件中注明。如有引用未注明，欢迎提 Issue 指正。

Some rules and scripts are adapted from community open-source projects, credited in the relevant files. Please open an issue if attribution is missing.

## 许可证 License

[MIT](./LICENSE) © 2026 Akira Le
