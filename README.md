# Proxy Configs

> A personal collection of proxy client configurations, rule sets, rewrite modules, and scripts for Shadowrocket, Loon, Surge, Stash, Clash, and Quantumult X.
>
> 个人维护的代理客户端配置集合，包含分流规则、重写模块、脚本、DNS 配置和客户端配置文件，适用于 Shadowrocket、Loon、Surge、Stash、Clash、Quantumult X 等客户端。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> [!WARNING]
> 本仓库仅供个人学习、研究网络技术与提升上网体验之用。请遵守所在国家和地区的法律法规，**请勿用于任何非法用途**。使用本仓库内容所产生的一切后果由使用者自行承担。
>
> This repository is for personal learning and research purposes only. Please comply with the laws and regulations of your country/region. The author is not responsible for any misuse.

## 目录 Contents

- [支持的客户端 Supported Clients](#支持的客户端-supported-clients)
- [仓库结构 Repository Structure](#仓库结构-repository-structure)
- [使用方法 Usage](#使用方法-usage)
  - [分流规则 Rules](#分流规则-rules)
  - [重写模块 Modules / Rewrites](#重写模块-modules--rewrites)
  - [脚本 Scripts](#脚本-scripts)
  - [DNS 配置 DNS](#dns-配置-dns)
  - [客户端配置 Client Configs](#客户端配置-client-configs)
- [订阅地址 Subscription URLs](#订阅地址-subscription-urls)
- [更新 Updating](#更新-updating)
- [鸣谢 Acknowledgements](#鸣谢-acknowledgements)
- [许可证 License](#许可证-license)

## 支持的客户端 Supported Clients

| 客户端 Client   | 平台 Platform        | 规则 Rules | 模块/重写 Modules | 脚本 Scripts |
| --------------- | -------------------- | :--------: | :---------------: | :----------: |
| Shadowrocket    | iOS                  |     ✅     |        ✅         |      ✅      |
| Loon            | iOS                  |     ✅     |        ✅         |      ✅      |
| Surge           | iOS / macOS          |     ✅     |        ✅         |      ✅      |
| Stash           | iOS / macOS          |     ✅     |        ✅         |      ✅      |
| Clash / Mihomo  | 全平台 Cross-platform |     ✅     |        ➖         |      ➖      |
| Quantumult X    | iOS                  |     ✅     |        ✅         |      ✅      |

## 仓库结构 Repository Structure

```text
proxy-configs/
├── rules/              # 分流规则 Rule sets（按分组组织 by category）
│   ├── direct/         #   直连规则 Direct rules
│   ├── proxy/          #   代理规则 Proxy rules
│   ├── reject/         #   广告拦截 Ad-blocking / reject rules
│   └── apps/           #   常见应用分流 Per-app rules
├── modules/            # 重写模块 Rewrite modules
│   ├── loon/           #   Loon (.plugin)
│   ├── surge/          #   Surge (.sgmodule)
│   ├── stash/          #   Stash (.stoverride)
│   └── qx/             #   Quantumult X (.snippet / .conf)
├── scripts/            # JavaScript 脚本 Scripts (.js)
├── dns/                # DNS 配置 DNS configuration
├── config/             # 完整客户端配置 Full client config templates
│   ├── clash/
│   ├── surge/
│   ├── loon/
│   └── ...
└── README.md
```

> 说明：以上为推荐的组织方式，实际目录会随内容补充逐步建立。
> Note: the layout above is the recommended structure; directories will be added as content grows.

## 使用方法 Usage

> 将下文 `<RAW_BASE>` 替换为本仓库的 raw 前缀：
> Replace `<RAW_BASE>` below with this repo's raw URL prefix:
>
> ```text
> https://raw.githubusercontent.com/akiralereal/proxy-configs/main
> ```
>
> 国内访问建议使用加速镜像（如 `https://ghproxy.com/` 或 jsDelivr `https://cdn.jsdelivr.net/gh/akiralereal/proxy-configs@main`）。
> For users in mainland China, a CDN mirror (jsDelivr / ghproxy) is recommended for reliability.

### 分流规则 Rules

在客户端的「规则 / Rule」中以远程规则集（Rule Set / Rule Provider）方式引用：

**Surge / Loon / Stash / Shadowrocket**

```ini
[Rule]
RULE-SET,<RAW_BASE>/rules/reject/reject.list,REJECT
RULE-SET,<RAW_BASE>/rules/proxy/proxy.list,PROXY
RULE-SET,<RAW_BASE>/rules/direct/direct.list,DIRECT
```

**Clash / Mihomo**

```yaml
rule-providers:
  proxy:
    type: http
    behavior: classical
    url: "<RAW_BASE>/rules/proxy/proxy.yaml"
    path: ./ruleset/proxy.yaml
    interval: 86400

rules:
  - RULE-SET,proxy,PROXY
```

**Quantumult X**

```ini
[filter_remote]
<RAW_BASE>/rules/proxy/proxy.list, tag=Proxy, force-policy=PROXY, enabled=true
```

### 重写模块 Modules / Rewrites

- **Loon**：`配置 → 插件 → 安装插件` 填入 `.plugin` 链接
- **Surge**：`首页 → 模块 → 从链接安装` 填入 `.sgmodule` 链接
- **Stash**：`覆写 Override → 添加` 填入 `.stoverride` 链接
- **Quantumult X**：`重写 → 引用` 添加 `.conf` / 在配置中引入 `.snippet`
- **Shadowrocket**：`配置 → 模块 → 添加` 填入模块链接

### 脚本 Scripts

脚本通常由重写模块自动引用，无需手动安装。直接引用示例（Surge）：

```ini
[Script]
example = type=http-response,pattern=^https?://example\.com/api,script-path=<RAW_BASE>/scripts/example.js,requires-body=true
```

### DNS 配置 DNS

`dns/` 目录提供推荐的 DNS / DoH / DoQ 配置片段，可整体或按需复制到客户端配置的 `[General]` / `dns` 段。

### 客户端配置 Client Configs

`config/` 提供各客户端的完整配置模板。导入后请将其中的**节点信息 / 订阅地址**替换为你自己的，仓库内不包含任何机场或节点。

> ⚠️ 本仓库**不提供任何代理节点或机场订阅**，仅提供规则与配置。节点需自行准备。
> This repo does **not** provide any proxy nodes/servers — bring your own.

## 订阅地址 Subscription URLs

| 类型 Type        | 链接 URL                                          |
| ---------------- | ------------------------------------------------- |
| 拦截规则 Reject  | `<RAW_BASE>/rules/reject/reject.list`             |
| 代理规则 Proxy   | `<RAW_BASE>/rules/proxy/proxy.list`               |
| 直连规则 Direct  | `<RAW_BASE>/rules/direct/direct.list`             |

## 更新 Updating

规则与模块通过远程链接引用，客户端会按设定的间隔（如每日）自动更新；也可在客户端中手动「更新订阅 / 更新模块」。

Rules and modules are referenced remotely and refresh automatically on the client's update interval, or can be updated manually.

## 鸣谢 Acknowledgements

部分规则与脚本思路参考自社区开源项目，在此一并致谢。如有引用未注明，欢迎提 Issue 指正。

Some rules and scripts are inspired by community open-source projects. Please open an issue if attribution is missing.

## 许可证 License

[MIT](./LICENSE) © 2026 Akira Le
