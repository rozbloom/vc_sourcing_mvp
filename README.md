# vc_sourcing_mvp
MVP of a VC sourcing tool inspired by Harmonic.ai:VC Intelligence Interface + Live Enrichment a web app that lets users discover/mock-search companies, view profiles, and enrich them with real-time AI-scraped data from public websites.

core workflow:
```mermaid
flowchart TD
    Discover --> OpenProfile[Open Profile]
    OpenProfile --> Enrich
    Enrich --> SaveList[Save / List]
    SaveList --> Export

    style Discover fill:#e6f7ff,stroke:#1890ff,stroke-width:2px
    style Export fill:#f6ffed,stroke:#52c41a,stroke-width:2px
