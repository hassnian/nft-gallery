<template>
  <section class="pt-8! md:pt-[3rem]!">
    <div class="container-fluid flex max-md:flex-col max-md:gap-8 justify-center md:justify-between items-center">
      <h1
        class="text-3xl md:text-[39px] md:leading-9 font-bold flex max-md:flex-col max-md:text-center md:gap-3 md:flex-wrap"
      >
        <span>
          {{ $t('search.landingTitle1') }}
        </span>
        <span
          class="inverse-text"
        >
          {{ $t('search.landingTitle2') }}
        </span>
        <span>
          {{ $t('search.landingTitle3') }}
        </span>
      </h1>

      <div class="shrink-0">
        <LandingFarcasterBanner />
      </div>
    </div>

    <div
      :key="usePrefix().urlPrefix.value"
      class="container-fluid mt-8! md:mt-[3rem]! mb-16"
    >
      <CarouselTypeDrops />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.with-divider {
  display: flex;
  align-items: center;

  &:before,
  &:after {
    content: '';
    display: block;
    width: 36px;
    height: 1px;
    background-color: var(--link-hover);
  }

  &:before {
    margin-right: 14px;
  }

  &:after {
    margin-left: 14px;
  }
}
</style>
