<template>
    <q-card class="auth-card q-pa-md">
        <q-card-section class="q-pa-none q-mt-md">
            <q-img src="src/assets/img/AuthPage/hand.svg" alt="DICARDZ" class="image-container" />
        </q-card-section>
        <q-card-section class="message-block q-pa-md text-center">
            <div class="text-h5 q-mb-md">Привет! Давай учить английский вместе</div>
            <q-btn label="Начать" color="purple" unelevated class="full-width"
                @click="$emit('change-component', 'AgeVerif')">
                <q-icon name="arrow_forward" class="q-ml-sm" />
            </q-btn>
        </q-card-section>
    </q-card>
</template>

<style scoped>
.auth-card {
    width: 100%;
    max-width: 500px;
    border-radius: 8px;
    box-shadow: none;
}

.image-container {
    margin: 0 auto;
}

.message-block {
    border-radius: 12px;
}

.full-width {
    width: 100%;
}

.q-icon {
    font-size: 23px;
}
</style>