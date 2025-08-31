<template>
    <div class="img_container">
        <img :src="src" alt="card_image" />
    </div>
</template>
<script setup>
defineProps({
    src: { type: String, default: '' },
});
</script>
<style scoped>
.img_container {
    max-width: 320px;
    height: auto;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

img {
    width: 100%;
    height: 100%;
    object-fit: fill;
    border-radius: 20px;
}
</style>
