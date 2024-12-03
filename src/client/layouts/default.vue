<template>
  <div>
    <header class="header relative">
      <LayoutDefaultHeader />
    </header>
    <main class="pt-[var(--layout-default-header-size)] min-h-[calc(100vh-var(--layout-default-header-size))]">
        <slot></slot>
    </main>
    <LayoutDefaultSupport />
    <footer class="mt-auto">
      <LayoutDefaultFooter />
    </footer>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
</script>

<style lang="sass">
:root
  --layout-default-header-size: 3.5rem
  --layout-default-nav-size: 250px
.header
  position: fixed
  top: 0
  left: 0
  width: 100%
  z-index: 1

  main
    position: relative
    grid-area: main

@media (min-width: 768px)
  .LayoutDefault
    --layout-nav-reponsize: 0
    grid-template-columns: var(--layout-default-nav-size) 1fr 0

@media (min-width: 1280px)
  .LayoutDefault
    --layout-nav-reponsize: 0
    grid-template-columns: var(--layout-default-nav-size) 1fr
</style>