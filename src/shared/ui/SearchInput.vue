<template>
    <div class="search-container" @click="handleContainerClick">
        <input
            type="text"
            :placeholder="placeholder"
            class="search-input"
            v-model="searchQuery"
            @keypress="handleKeyPress"
            ref="inputRef"
        />
        <button v-if="searchQuery.trim()" class="clear-button" @click="clearSearch">×</button>
        <img
            src="@/assets/icons/profile/search.svg"
            alt="search"
            class="search-icon"
            @click="handleSearchClick"
        />
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const emit = defineEmits(['search']);
const props = defineProps({
    placeholder: { type: String, default: '' },
    enableAutoSearch: { type: Boolean, default: false },
});

const inputRef = ref(null);
const searchQuery = ref('');
let searchTimeout = null;

const handleKeyPress = (event) => {
    if (event.key === 'Enter' && searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim());
    }
};

const handleSearchClick = () => {
    if (searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim());
    }
};

const handleContainerClick = () => {
    inputRef.value?.focus();
};

watch(searchQuery, (newVal) => {
    if (!newVal.trim()) {
        emit('search', '');
    }
});

const clearSearch = () => {
    searchQuery.value = '';
    emit('search', '');
    inputRef.value?.focus();
};

watch(searchQuery, (newVal) => {
    if (props.enableAutoSearch) {
        clearTimeout(searchTimeout);
        if (newVal.trim()) {
            searchTimeout = setTimeout(() => {
                emit('search', newVal.trim());
            }, 500);
        } else {
            emit('search', '');
        }
    }
});

onBeforeUnmount(() => {
    clearTimeout(searchTimeout);
});
</script>

<style scoped>
.search-container {
    position: relative;
    margin-bottom: 20px;
    cursor: text;
}

.search-input {
    width: 100%;
    margin-top: 10px;
    padding: 12px 40px 12px 30px;
    border: 1px solid #262060;
    border-radius: 12px;
    font-size: 16px;
    outline: none;
    transition: all 0.3s ease;
}

.search-input:focus {
    border-color: #5a3fc8;
    box-shadow: 0 0 0 3px rgba(90, 63, 200, 0.1);
}

.search-icon {
    position: absolute;
    right: 15px;
    top: 58%;
    transform: translateY(-50%);
    width: 22px;
    height: 22px;
    pointer-events: none;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.search-icon:hover {
    transform: translateY(-50%) scale(1.1);
}

.clear-button {
    position: absolute;
    right: 40px;
    top: 55%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #311d5d;
    opacity: 0.7;
}
</style>

<style>
.search-input::placeholder {
    font-size: 16px;
    font-weight: 600;
    color: #311d5d;
}
</style>
