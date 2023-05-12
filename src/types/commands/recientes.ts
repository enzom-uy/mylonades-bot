import {
    ActionRow,
    AutoModerationRuleManager,
    ButtonInteraction,
    CacheType,
    ChannelSelectMenuInteraction,
    Collection,
    CollectorFilter,
    GuildApplicationCommandManager,
    GuildBanManager,
    GuildChannelManager,
    GuildEmojiManager,
    GuildInviteManager,
    GuildMemberManager,
    GuildScheduledEventManager,
    GuildStickerManager,
    MentionableSelectMenuInteraction,
    PresenceManager,
    ReactionManager,
    RoleManager,
    RoleSelectMenuInteraction,
    StageInstanceManager,
    StringSelectMenuInteraction,
    SystemChannelFlagsBitField,
    UserSelectMenuInteraction,
    VoiceStateManager
} from 'discord.js'

interface User {
    id: string
    bot: boolean
    system: boolean
    flags: {
        bitfield: number
    }
    username: string
    discriminator: string
    avatar: string | null
    banner: string | undefined
    accentColor: string | undefined
}

interface Guild {
    id: string
    name: string
    icon: string | null
    features: string[]
    commands: GuildApplicationCommandManager
    members: GuildMemberManager
    channels: GuildChannelManager
    bans: GuildBanManager
    roles: RoleManager
    presences: PresenceManager
    voiceStates: VoiceStateManager
    stageInstances: StageInstanceManager
    invites: GuildInviteManager
    scheduledEvents: GuildScheduledEventManager
    autoModerationRules: AutoModerationRuleManager
    available: boolean
    shardId: number
    splash: string | null
    banner: string | null
    description: string | null
    verificationLevel: number
    vanityURLCode: string | null
    nsfwLevel: number
    premiumSubscriptionCount: number
    discoverySplash: string | null
    memberCount: number
    large: boolean
    premiumProgressBarEnabled: boolean
    applicationId: string | null
    afkTimeout: number
    afkChannelId: string | null
    systemChannelId: string
    premiumTier: number
    widgetEnabled: boolean | null
    widgetChannelId: string | null
    explicitContentFilter: number
    mfaLevel: number
    joinedTimestamp: number
    defaultMessageNotifications: number
    systemChannelFlags: SystemChannelFlagsBitField
    maximumMembers: number
    maximumPresences: null
    maxVideoChannelUsers: number
    maxStageVideoChannelUsers: number
    approximateMemberCount: null
    approximatePresenceCount: null
    vanityURLUses: null
    rulesChannelId: null
    publicUpdatesChannelId: null
    preferredLocale: string
    safetyAlertsChannelId: null
    ownerId: string
    emojis: GuildEmojiManager
    stickers: GuildStickerManager
}

export interface GuildMember {
    guild: Guild
    joinedTimestamp: number
    premiumSinceTimestamp: null
    nickname: string | null
    pending: boolean
    communicationDisabledUntilTimestamp: null
    _roles: string[]
    user: User
    avatar: string | null
    flags: {
        bitfield: number
    }
}

export interface DiscordComponentConfirmationResponse {
    channelId: string
    guildId: string
    id: string
    createdTimestamp: number
    type: number
    system: boolean
    content: string
    author: {
        id: string
        bot: boolean
        system: boolean
        flags: {
            bitfield: number
        }
        username: string
        discriminator: string
        avatar: string
        banner: string | undefined
        accentColor: string | undefined
        verified: true
        mfaEnabled: false
    }
    pinned: boolean
    tts: boolean
    nonce: null
    embeds: []
    components: [ActionRow<any>]
    attachments: Collection<unknown, unknown>
    stickers: Collection<unknown, unknown>
    position: null
    roleSubscriptionData: null
    editedTimestamp: null
    reactions: ReactionManager
    mentions: {
        everyone: boolean
        users: Collection<unknown, unknown>
        roles: Collection<unknown, unknown>
        repliedUser: null
    }
    webhookId: string
    groupActivityApplication: null
    applicationId: string
    activity: null
    flags: any
    reference: {
        channelId: string
        guildId: string
        messageId: string
    }
    interaction: null
    customId: string
    componentType: number
    deferred: false
    ephemeral: null
    replied: false
    webhook: any
    values: string[]
    update: ({ content, components }: { content: any; components: any }) => Promise<any>
}

export type Filter = CollectorFilter<
    [
        | StringSelectMenuInteraction<CacheType>
        | UserSelectMenuInteraction<CacheType>
        | RoleSelectMenuInteraction<CacheType>
        | MentionableSelectMenuInteraction<CacheType>
        | ChannelSelectMenuInteraction<CacheType>
        | ButtonInteraction<CacheType>
        | UserSelectMenuInteraction<CacheType>
        | RoleSelectMenuInteraction<CacheType>
        | MentionableSelectMenuInteraction<CacheType>
        | ChannelSelectMenuInteraction<CacheType>
    ]
>
