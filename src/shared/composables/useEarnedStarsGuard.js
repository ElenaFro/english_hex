import { ref, onMounted, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

// Предохранитель от потери прогресса игры и ещё не начисленных звёзд.
// Прогресс игры и заработанные звёзды нигде не персистятся до страницы планеты
// (MyPlanetPage). Если уйти из активной игры или с экрана результата «мимо» штатного
// флоу (кнопка «назад», «на главную», обновление/закрытие вкладки) — всё теряется.
// Этот composable показывает предупреждение перед уходом и пускает дальше только при
// подтверждении. Штатные переходы (на gameResult/myPlanet) не блокируются.

// Маршруты, переход на которые — часть штатного игрового флоу (туда уходить можно без
// предупреждения): экран результата и страницы начисления звёзд.
const SAVE_FLOW_ROUTES = new Set(['gameResult', 'myPlanet']);

// Флаг намеренной перезагрузки страницы (например, кнопка «Пройти ещё раз» через
// window.location.reload) — чтобы beforeunload не показывал нативное предупреждение.
let skipNextUnload = false;
export function allowUnload() {
    skipNextUnload = true;
}

/**
 * @param {() => boolean} hasUnsavedProgress — идёт ли игра / есть ли незачисленные звёзды.
 */
export function useEarnedStarsGuard(hasUnsavedProgress) {
    const showExitWarning = ref(false);
    let resolveNav = null;
    // Разрешить следующий внутренний переход без предупреждения (намеренные действия в флоу).
    let bypassNextRouteLeave = false;

    const allowLeave = () => {
        bypassNextRouteLeave = true;
    };

    onBeforeRouteLeave((to) => {
        if (bypassNextRouteLeave) {
            bypassNextRouteLeave = false;
            return true;
        }
        if (!hasUnsavedProgress() || SAVE_FLOW_ROUTES.has(to.name)) return true;
        return new Promise((resolve) => {
            showExitWarning.value = true;
            resolveNav = resolve;
        });
    });

    const confirmExit = () => {
        // Пользователь подтвердил выход — звёзды не сохраняем.
        showExitWarning.value = false;
        resolveNav?.(true);
        resolveNav = null;
    };

    const cancelExit = () => {
        // Остаёмся на экране результата.
        showExitWarning.value = false;
        resolveNav?.(false);
        resolveNav = null;
    };

    const handleBeforeUnload = (event) => {
        if (skipNextUnload) {
            skipNextUnload = false;
            return;
        }
        if (!hasUnsavedProgress()) return;
        event.preventDefault();
        event.returnValue = '';
    };

    onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload));
    onBeforeUnmount(() => window.removeEventListener('beforeunload', handleBeforeUnload));

    return { showExitWarning, confirmExit, cancelExit, allowLeave };
}
