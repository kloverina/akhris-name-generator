import { ref } from 'vue';
import {generators} from "../generators/registry.ts";
import {GeneratedName, GeneratorParams} from "../generators/types.ts";


export function useNameGenerator(generatorId: string) {
    const generator = generators.find(
        item => item.id === generatorId,
    );

    const result = ref<GeneratedName | null>(null);

    function generate(params: GeneratorParams) {
        if (!generator) return;

        result.value = generator.generate(params);
    }

    return {
        generator,
        result,
        generate,
    };
}