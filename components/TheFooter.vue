<template>
  <footer
    class="footer-container px-6 py-12"
    data-testid="footer-container"
  >
    <div class="footer-container-inner flex md:justify-between">
      <section class="footer-container-subs flex flex-col">
        <h2 class="subtitle is-5">
          {{ $t('footer.subscribe') }}
        </h2>
        <div class="flex items-center footer-container-subs-items">
          <CustomSubstackEmbed />
        </div>
      </section>
      <div class="footer-container-links">
        <section class="footer-container-info flex flex-col">
          <h2 class="subtitle is-5">
            Incentives
          </h2>
          <div>
            <ul class="footer-container-list">
              <li
                v-for="item in menuIncentives"
                :key="item.url"
                class="footer-container-info-list-item"
              >
                <a
                  v-if="item.external"
                  v-safe-href="item.url"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="flex items-center"
                >
                  {{ item.name }}
                  <KIcon
                    name="i-mdi:arrow-top-right"
                    class="ml-1 text-k-grey"
                  />
                </a>
                <nuxt-link
                  v-else
                  :to="item.url"
                >
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </section>
        <section class="footer-container-info flex flex-col">
          <h2 class="subtitle is-5">
            Marketplace
          </h2>
          <div>
            <ul class="footer-container-list">
              <li
                v-for="item in menuMarketplace"
                :key="item.url"
                class="footer-container-info-list-item"
              >
                <a
                  v-if="item.external"
                  v-safe-href="item.url"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="flex items-center"
                >
                  {{ item.name }}
                  <KIcon
                    name="i-mdi:arrow-top-right"
                    class="ml-1 text-k-grey"
                  />
                </a>
                <nuxt-link
                  v-else
                  :to="item.url"
                >
                  {{ item.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <section class="footer-container-info flex flex-col">
        <h2 class="subtitle is-5">
          KodaDot
        </h2>
        <div>
          <ul class="footer-container-list">
            <li
              v-for="item in menuKodadot"
              :key="item.url"
              class="footer-container-info-list-item"
            >
              <a
                v-if="item.external"
                v-safe-href="item.url"
                target="_blank"
                rel="nofollow noopener noreferrer"
                class="flex items-center"
              >
                {{ item.name }}
                <KIcon
                  name="i-mdi:arrow-top-right"
                  class="ml-1 text-k-grey"
                />
              </a>
              <nuxt-link
                v-else
                :to="item.url"
                class="flex items-center"
              >
                {{ item.name }}
                <KIcon
                  v-if="item.highlight"
                  name="i-mdi:star-four-points"
                  class="text-k-primary text-xl ml-1"
                />
              </nuxt-link>
            </li>
          </ul>
        </div>
      </section>
      <section class="footer-container-info flex flex-col">
        <h2 class="subtitle is-5">
          {{ $t('footer.join') }}
        </h2>
        <ul
          class="footer-container-list columns-1"
          data-testid="footer-social-list"
        >
          <li
            v-for="item in socials"
            :key="item.url"
          >
            <a
              v-if="item.url"
              v-safe-href="item.url"
              target="_blank"
              rel="nofollow noopener noreferrer"
              class="flex items-center"
            >
              {{ item.name }}
              <KIcon
                name="i-mdi:arrow-top-right"
                class="ml-1 text-k-grey"
              />
            </a>
          </li>
        </ul>
      </section>
    </div>
    <img
      src="/blurred-landing-footer.webp"
      class="left-blurred-image"
      width="1500"
      height="1400"
      alt=""
    >
  </footer>
</template>

<script lang="ts" setup>
interface Menu {
  name: string
  url: string
  external?: boolean
  highlight?: boolean
}

const { $i18n } = useNuxtApp()

const menuIncentives: Menu[] = [
  {
    name: $i18n.t('ambassador program'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/ambassador-program',
    external: true,
  },
  {
    name: $i18n.t('artist ambassador'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/artist-ambassador-program',
    external: true,
  },

  {
    name: $i18n.t('referralProgram'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/kodadots-programs/artist-referral-program',
    external: true,
  },
]

const menuMarketplace: Menu[] = [
  {
    name: $i18n.t('developers'),
    url: 'https://developers.kodadot.xyz',
    external: true,
  },
  {
    name: 'FAQ',
    url: 'https://hello.kodadot.xyz/ecosystem/faq',
    external: true,
  },
  {
    name: $i18n.t('tutorial'),
    url: 'https://hello.kodadot.xyz/tutorial/',
    external: true,
  },
]

const menuKodadot: Menu[] = [
  {
    name: $i18n.t('whyKoda.title'),
    url: '/why-koda',
    highlight: true,
  },
  {
    name: $i18n.t('footer.guide'),
    url: 'https://hello.kodadot.xyz/about-us/who-are-we',
    external: true,
  },
  {
    name: $i18n.t('careers'),
    url: 'https://hello.kodadot.xyz/be-part-of-kodadot/join-as-a-developer/hiring',
    external: true,
  },
  {
    name: $i18n.t('press kit'),
    url: 'https://github.com/kodadot/kodadot-presskit/tree/main/v4',
    external: true,
  },
  {
    name: $i18n.t('blog'),
    url: '/blog',
    external: false,
  },
  {
    name: $i18n.t('footer.privacyPolicy'),
    url: '/privacy-policy',
    external: false,
  },
  {
    name: $i18n.t('footer.toc'),
    url: '/terms-of-use',
    external: false,
  },
]

const socials = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/KodaDot',
  },
  {
    name: 'Farcaster',
    url: 'https://warpcast.com/~/channel/koda',
  },
  {
    name: 'Telegram',
    url: 'https://t.me/koda_eco',
  },
  {
    name: 'Beehiiv',
    url: 'https://kodadotweeklyroundup.beehiiv.com',
  },
  {
    name: 'Linkedin',
    url: 'https://www.linkedin.com/company/kodadot',
  },
  {
    name: 'Medium',
    url: 'https://medium.com/kodadot',
  },
  {
    name: 'Youtube',
    url: 'https://www.youtube.com/channel/UCEULduld5NrqOL49k1KVjoA/',
  },
]
</script>
