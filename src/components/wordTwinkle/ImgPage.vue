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
    width: 100%;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card_image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
}
</style>
