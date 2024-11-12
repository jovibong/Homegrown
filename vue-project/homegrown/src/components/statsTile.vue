<script setup>
import { ref, defineProps, watch } from 'vue'
import Modal from './statsModal.vue'

const props = defineProps({
    title: String,
    statNonEditable: String,
    statEditable: [String, Number, Date],
    descriptionNonEditable: String,
    descriptionEditable: [String, Number, Date],
})

const showModal = ref(false)

// Watch the props and log their values when they change
watch(() => [props.title, props.statNonEditable, props.statEditable, props.descriptionNonEditable, props.descriptionEditable], (newValues) => {
    return newValues;
}, { immediate: true }); // Logs the values immediately on first run

</script>

<template>

    <div>

        <div class="d-flex justify-content-start align-items-center mb-2">
            <span class="fw-bold ps-2">{{ title }}</span>
            <button class="tile-interact p-2" id="show-modal" @click="showModal = true">
                <i class='fas fa-edit'></i>
            </button>
            <Teleport to="body">
                <!-- use the modal component, pass in the prop -->
                <Modal :show="showModal" @close="showModal = false" :title="title" :statNonEditable="statNonEditable"
                    :statEditable="statEditable" :descriptionNonEditable="descriptionNonEditable"
                    :descriptionEditable="descriptionEditable">
                    <template #header>
                        <div class="w-100">
                            <h2>{{ title }}</h2>
                            <hr>
                        </div>

                    </template>
                </modal>
            </Teleport>
        </div>
        <div>
            <h1 class="text-center text-primary fw-bolder display-5">{{ statNonEditable }}<span class="edit">{{
                statEditable
            }}</span>
            </h1>
        </div>
        <div>
            <p class="text-center text-muted">{{ descriptionNonEditable }}<span class="edit">{{ descriptionEditable
                    }}</span>
            </p>
        </div>

    </div>

</template>


<style scoped>
/* try to flicker edit when hover over tile-interact. prob is they are not siblings or child */
.tile-interact {
    color: rgba(255, 207, 89, 1);
    transition: color 0.2s;
}

.tile-interact:hover {
    color: red;
}

.tile-interact:active {
    color: green;
}

button {
    background: transparent;
    border: none;
}



/* bento btn animation */
@keyframes pulse {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.5);
    }

    100% {
        transform: scale(1);
    }
}

.bento-tile:hover .tile-interact {

    animation: pulse 2s 3;

}

/* words edit animation */
@keyframes flicker {
    0% {
        opacity: 100%;
    }

    50% {
        opacity: 50%;
    }

    100% {
        opacity: 100%;
    }
}

.bento-tile:hover .edit {

    animation: flicker 2s 3;

}
</style>




