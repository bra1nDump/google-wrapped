import { createRoot, Root } from "react-dom/client";
import React, { FunctionComponent } from "react";


export type Cmd<Msg> = (_program: Program<any, Msg>) => void;
export type Sub<Msg> =
        { sub: (_data: any, _dispatch: (_msg: Msg) => void) => void
        , unsub: (_data: any) => void
        , update: (_update: any) => void
        , hash: (_data: any) => string
        , data: any
        }

type Init<Model, Msg> =
    { init : () => [Model, Array<Cmd<Msg>>]
    , view : FunctionComponent<Model>
    , update : (_msg: Msg, _model: Model) => [Model, Array<Cmd<Msg>>]
    , subscriptions : (model: Model) => Array<Sub<Msg>>
    , rootContainer : Element
    }

export type Program<Model, Msg> =
    { init : Init<Model, Msg>
    , subscriptions : Record<string, Sub<Msg>>
    , root : Root
    , model : Model
    , applyMsg: (_msg: Msg) => void
    }


export function start<Model, Msg>(config: Init<Model, Msg>): Program<Model, Msg> {
    let [ model, cmds ] = config.init();
    const root = createRoot(config.rootContainer);
    const program: Program<Model, Msg> =
        { init: config
        , subscriptions: {}
        , root: root
        , model: model
        , applyMsg: applyMsg
        };

    function applyMsg(msg: Msg) {
        const [ newModel, cmds ] = config.update(msg, model);
        model = newModel;
        root.render(config.view(model));
        //runCmds(cmds)
        //const subscriptions = config.subscriptions(model);
        //applySubs(subscriptions);
    }

    root.render(config.view(program.model));
    //runCmds(cmds)
    //const subscriptions = config.subscriptions(model);
    //applySubs(subscriptions);
    return program;
}

