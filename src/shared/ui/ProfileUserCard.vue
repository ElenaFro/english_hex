<template>
    <section class="profile-user-card" :class="avatarClass">
        <div class="profile-user-card__avatar">
            <img :src="avatarIcon" alt="" class="profile-user-card__avatar-img" />
        </div>

        <div class="profile-user-card__info">
            <p class="profile-user-card__name">{{ displayName }}</p>
            <div class="profile-user-card__stars">
                <span class="profile-user-card__stars-value">{{ displayRating }}</span>
                <img class="profile-user-card__stars-icon" :src="yellowStarIcon" alt="" />
            </div>
            <div v-if="!isSelfProfile">
                <button
                    v-if="isCanAddToFriends && !isTeacher"
                    @click="addToFriend"
                    class="button button--blue d-mt-6"
                >
                    Добавить в друзья
                </button>
                <button
                    v-if="isCanAddToClass"
                    @click="addToClass"
                    class="button button--blue d-mt-6"
                >
                    Добавить в класс
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue';
import BoyIcon from '@/assets/img/DefaultUserAvatar/male.webp';
import GirlIcon from '@/assets/img/DefaultUserAvatar/female.svg';
import yellowStarIcon from '@/assets/icons/yelow_star.svg';
import { useUserStore } from '@/stores/user';
import { useTeacherStore } from '@/stores/teacher';
import { useRoute } from 'vue-router';

const props = defineProps({
    user: { type: Object, required: true },
    avatarSrc: { type: String, default: '' },
    avatarSize: { type: String, default: '' },
    isCanAddToFriends: { type: Boolean, default: false },
});

const emit = defineEmits(['update:user']);
const route = useRoute();
const userStore = useUserStore();
const teacherStore = useTeacherStore();

const isTeacher = computed(() => userStore.isTeacher);

const selectedClassId = computed(() => teacherStore.currentClass.id ?? route.query.classId);

const displayName = computed(() => props.user.name || 'Пользователь');
const displayRating = computed(() => props.user.rating ?? 0);
const avatarIcon = computed(() =>
    props.avatarSrc ? props.avatarSrc : props.user.gender === 'male' ? BoyIcon : GirlIcon
);

const isSelfProfile = computed(() => (route.params.id || props.user.id) == userStore.user.id);

const avatarClass = computed(() => ({ lg: props.avatarSize }));

const isCanAddToClass = computed(
    () => isTeacher.value && !isSelfProfile.value && !props.user?.is_in_class
);

const addToClass = async () => {
    await teacherStore.addStudentToClass(selectedClassId.value, route.params.id);
};

const addToFriend = async () => {
    await userStore.addToFriend(props.user.id);
    emit('update:user');
};
</script>

<style scoped lang="scss">
.profile-user-card {
    display: grid;
    grid-template-columns: 105px 1fr;
    align-items: center;
    gap: 20px;
    border-radius: 20px;
    z-index: 2;

    &__avatar {
        width: 105px;
        height: 105px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #262060;
        overflow: hidden;

        &-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: top;
        }
    }

    &__info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
    }

    &__name {
        margin: 0;
        font-size: 26px;
        font-weight: 800;
        line-height: 1.1;
        color: #311d5d;
    }

    &__stars {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        margin-top: 6px;

        &-value {
            font-size: 20px;
            font-weight: 700;
            line-height: 1;
            color: #262060;
        }

        &-icon {
            width: 25px;
            height: 25px;
        }
    }
}

.profile-user-card.lg {
    grid-template-columns: 119px 1fr;

    .profile-user-card__avatar {
        width: 119px;
        height: 119px;
    }
}
</style>
