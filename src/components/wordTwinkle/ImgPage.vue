<template>
    <img :src="src" alt="card_image" />
</template>
<script setup>
defineProps({
    src: { type: String, default: '' },
});
</script>
