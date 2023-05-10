// Axios
interface ContentUrls {
  '100pxGif': {
    url: string
    size: number
    width: number
    height: number
  }
  largeGif: {
    url: string
    size: number
    width: number
    height: number
  }
  max1mbGif: {
    url: string
    size: number
    width: number
    height: number
  }
  max2mbGif: {
    url: string
    size: number
    width: number
    height: number
  }
  max5mbGif: {
    url: string
    size: number
    width: number
    height: number
  }
  mobile: {
    url: string
    size: number
    width: number
    height: number
  }
  mobilePoster: {
    url: string
    size: number
    width: number
    height: number
  }
  mp4: {
    url: string
    size: number
    width: number
    height: number
  }
  webm: {
    url: string
    size: number
    width: number
    height: number
  }
  webp: {
    url: string
    size: number
    width: number
    height: number
  }
}

export interface GetGfyInfoResponse {
  gfyItem: {
    avgColor: string
    content_urls: ContentUrls
    createDate: number
    description: string
    frameRate: number
    gatekeeper: number
    gfyId: string
    gfyName: string
    gfyNumber: number
    gfySlug: string
    gif100px: string
    gifUrl: string
    hasAudio: boolean
    hasTransparency: boolean
    height: number
    languageCategories: string[]
    likes: number
    max1mbGif: string
    max2mbGif: string
    max5mbGif: string
    md5: string
    miniPosterUrl: string
    miniUrl: string
    mobilePosterUrl: string
    mobileUrl: string
    mp4Size: number
    mp4Url: string
    nsfw: number
    numFrames: number
    posterUrl: string
    published: number
    tags: string[]
    thumb100PosterUrl: string
    title: string
    userData: {
      followers: number
      following: number
      subscription: number
      username: string
      verified: boolean
      views: number
    }
    username: string
    views: number
    webmSize: number
    webmUrl: string
    webpUrl: string
    width: number
    isSticker: boolean
  }
}

// Command arguments

export interface StringOptions {
  title: string
  description: string
  required: boolean
}
