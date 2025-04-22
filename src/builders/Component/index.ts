/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    APIInteractionResponse,
    APIMessageComponentButtonInteraction,
    APIMessageComponentSelectMenuInteraction,
    APIModalSubmitInteraction,
    ComponentType,
} from '@discordjs/core';
import { Awaitable } from '@discordjs/util';

/**
 * Builder for button components.
 */
export class ButtonComponentFileBuilder {
    constructor(
        private file: {
            customId: string;
            execute: (
                interaction: APIMessageComponentButtonInteraction
            ) => Awaitable<APIInteractionResponse>;
        }
    ) {}

    /**
     * Get the custom ID of the button component.
     */
    get customId() {
        return this.file.customId;
    }

    /**
     * Execute the button component's handler.
     * @param interaction - The button interaction object.
     */
    execute(interaction: APIMessageComponentButtonInteraction) {
        return this.file.execute(interaction);
    }
}

/**
 * Builder for select menu components.
 */
export class SelectMenuComponentFileBuilder {
    constructor(
        private file: {
            customId: string;
            execute: (
                interaction: APIMessageComponentSelectMenuInteraction
            ) => Awaitable<APIInteractionResponse>;
        }
    ) {}

    /**
     * Get the custom ID of the select menu component.
     */
    get customId() {
        return this.file.customId;
    }

    /**
     * Execute the select menu component's handler.
     * @param interaction - The select menu interaction object.
     */
    execute(interaction: APIMessageComponentSelectMenuInteraction) {
        return this.file.execute(interaction);
    }
}

/**
 * Builder for modal submit components.
 */
export class ModalSubmitComponentFileBuilder {
    constructor(
        private file: {
            customId: string;
            execute: (
                interaction: APIModalSubmitInteraction
            ) => Awaitable<APIInteractionResponse>;
        }
    ) {}

    /**
     * Get the custom ID of the modal submit component.
     */
    get customId() {
        return this.file.customId;
    }

    /**
     * Execute the modal submit component's handler.
     * @param interaction - The modal submit interaction object.
     */
    execute(interaction: APIModalSubmitInteraction) {
        return this.file.execute(interaction);
    }
}

/**
 * Union type for all component builders.
 */
export type ComponentBuilder =
    | ButtonComponentFileBuilder
    | SelectMenuComponentFileBuilder
    | ModalSubmitComponentFileBuilder;

/**
 * Factory method for creating a button component builder.
 * @param file - The button component definition.
 */
export function componentFileBuilder(file: {
    type: ComponentType.Button;
    customId: string;
    execute: (
        interaction: APIMessageComponentButtonInteraction
    ) => Awaitable<APIInteractionResponse>;
}): ButtonComponentFileBuilder;

/**
 * Factory method for creating a select menu component builder.
 * @param file - The select menu component definition.
 */
export function componentFileBuilder(file: {
    type:
        | ComponentType.StringSelect
        | ComponentType.UserSelect
        | ComponentType.RoleSelect
        | ComponentType.MentionableSelect
        | ComponentType.ChannelSelect;
    customId: string;
    execute: (
        interaction: APIMessageComponentSelectMenuInteraction
    ) => Awaitable<APIInteractionResponse>;
}): SelectMenuComponentFileBuilder;

/**
 * Factory method for creating a modal submit component builder.
 * @param file - The modal submit component definition.
 */
export function componentFileBuilder(file: {
    type: 'modal';
    customId: string;
    execute: (
        interaction: APIModalSubmitInteraction
    ) => Awaitable<APIInteractionResponse>;
}): ModalSubmitComponentFileBuilder;

/**
 * Factory method implementation for creating component builders.
 * @param file - The component definition.
 * @returns A specific component builder based on the type.
 */
export function componentFileBuilder(
    file:
        | {
              type: ComponentType.Button;
              customId: string;
              execute: (
                  interaction: APIMessageComponentButtonInteraction
              ) => Awaitable<APIInteractionResponse>;
          }
        | {
              type:
                  | ComponentType.StringSelect
                  | ComponentType.UserSelect
                  | ComponentType.RoleSelect
                  | ComponentType.MentionableSelect
                  | ComponentType.ChannelSelect;
              customId: string;
              execute: (
                  interaction: APIMessageComponentSelectMenuInteraction
              ) => Awaitable<APIInteractionResponse>;
          }
        | {
              type: 'modal';
              customId: string;
              execute: (
                  interaction: APIModalSubmitInteraction
              ) => Awaitable<APIInteractionResponse>;
          }
): ComponentBuilder {
    // 根據類型創建不同的組件建構器
    if (file.type === ComponentType.Button) {
        return new ButtonComponentFileBuilder({
            customId: file.customId,
            execute: file.execute as (
                interaction: APIMessageComponentButtonInteraction
            ) => Awaitable<APIInteractionResponse>,
        });
    } else if (
        file.type === ComponentType.StringSelect ||
        file.type === ComponentType.UserSelect ||
        file.type === ComponentType.RoleSelect ||
        file.type === ComponentType.MentionableSelect ||
        file.type === ComponentType.ChannelSelect
    ) {
        return new SelectMenuComponentFileBuilder({
            customId: file.customId,
            execute: file.execute as (
                interaction: APIMessageComponentSelectMenuInteraction
            ) => Awaitable<APIInteractionResponse>,
        });
    } else if (file.type === 'modal') {
        return new ModalSubmitComponentFileBuilder({
            customId: file.customId,
            execute: file.execute as (
                interaction: APIModalSubmitInteraction
            ) => Awaitable<APIInteractionResponse>,
        });
    }

    // 以下用於類型安全，不會執行到這裡
    throw new Error(`不支援的組件類型: ${file.type}`);
}

/**
 * Component class as the main interface for components.
 * @deprecated Use ComponentBuilder instead.
 */
export class Component<T extends ComponentType | 'modal'> {
    private builder: ComponentBuilder;

    // 按鈕組件
    constructor(
        file: T extends ComponentType.Button
            ? {
                  type: ComponentType.Button;
                  customId: string;
                  execute: (
                      interaction: APIMessageComponentButtonInteraction
                  ) => Awaitable<APIInteractionResponse>;
              }
            : never
    );

    // 選單組件
    constructor(
        file: T extends
            | ComponentType.StringSelect
            | ComponentType.UserSelect
            | ComponentType.RoleSelect
            | ComponentType.MentionableSelect
            | ComponentType.ChannelSelect
            ? {
                  type: T;
                  customId: string;
                  execute: (
                      interaction: APIMessageComponentSelectMenuInteraction
                  ) => Awaitable<APIInteractionResponse>;
              }
            : never
    );

    // 模態框提交
    constructor(
        file: T extends 'modal'
            ? {
                  type: 'modal';
                  customId: string;
                  execute: (
                      interaction: APIModalSubmitInteraction
                  ) => Awaitable<APIInteractionResponse>;
              }
            : never
    );

    // 實作
    constructor(file: any) {
        this.builder = componentFileBuilder(file);
    }

    /**
     * Get the custom ID of the component.
     */
    get customId() {
        return this.builder.customId;
    }

    /**
     * Execute the component's handler.
     * @param interaction - The interaction object.
     */
    execute(interaction: any) {
        return this.builder.execute(interaction);
    }

    /**
     * Check if the component is a button.
     * @returns True if the component is a button.
     */
    isButton(): this is Component<ComponentType.Button> {
        return this.builder instanceof ButtonComponentFileBuilder;
    }

    /**
     * Check if the component is a select menu.
     * @returns True if the component is a select menu.
     */
    isSelectMenu(): this is Component<
        | ComponentType.StringSelect
        | ComponentType.UserSelect
        | ComponentType.RoleSelect
        | ComponentType.MentionableSelect
        | ComponentType.ChannelSelect
    > {
        return this.builder instanceof SelectMenuComponentFileBuilder;
    }

    /**
     * Check if the component is a modal submit.
     * @returns True if the component is a modal submit.
     */
    isModalSubmit(): this is Component<'modal'> {
        return this.builder instanceof ModalSubmitComponentFileBuilder;
    }
}
