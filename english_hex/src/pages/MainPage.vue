<template>
    <section class="page">
        <section>
        </section>
        <loader v-if="loading" />
        <HelloPopup v-if="openHelloPopup" @close="closePopup" />
    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import loader from '../components/loader.vue';
import HelloPopup from '../components/popups/HelloPopup.vue';
const loading = ref(true);
const openHelloPopup = ref(false);

onMounted(() => {
    loading.value = false;
    openHelloPopup.value = true;
})

const closePopup = () => {
    openHelloPopup.value = !openHelloPopup.value
}
</script>

<style scoped>
.page {
    width: 100%;
    height: 100vh;
    min-height: 100%;
    display: flex;
    padding: 40px 30px;
    row-gap: 25px;
    background-color: none;
    flex-direction: column;
    align-items: center;
    margin-top: 76px;
}
</style>
