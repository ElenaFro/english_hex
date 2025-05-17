<template>
  <q-layout class="layout">
    <q-header>
      <q-toolbar>

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-toolbar-title>
        Quasar App
      </q-toolbar-title>
    </q-footer>
  </q-layout>
</template>

<script setup>

</script>

<style>
.layout {
  display: flex;
  max-width: 480px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.q-drawer {
  left: 33%
}
</style>
