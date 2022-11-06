import { createRoot, Root } from "react-dom/client";
import React, { FunctionComponent } from "react";

export type Cmd<Msg> = (_program: Program<any, Msg>) => void;
export type Sub<Msg> = {
  sub: (_data: any, _dispatch: (_msg: Msg) => void) => void;
  unsub: (_data: any) => void;
  update: (_update: any) => void;
  hash: (_data: any) => string;
  data: any;
};

type Init<Model extends {}, Msg> = {
  init: () => [Model, Array<Cmd<Msg>>];
  view: FunctionComponent<Model>;
  update: (_msg: Msg, _model: Model) => [Model, Array<Cmd<Msg>>];
  subscriptions: (model: Model) => Array<Sub<Msg>>;
  rootContainer: Element;
};

export type Program<Model extends {}, Msg> = {
  init: Init<Model, Msg>;
  subscriptions: Record<string, Sub<Msg>>;
  root: Root;
  model: Model;
  applyMsg: (_msg: Msg) => void;
};

export function start<Model extends {}, Msg>(
  config: Init<Model, Msg>
): Program<Model, Msg> {
  let [model, cmds] = config.init();
  const root = createRoot(config.rootContainer);
  const program: Program<Model, Msg> = {
    init: config,
    subscriptions: {},
    root: root,
    model: model,
    applyMsg: applyMsg,
  };

  function runCmds(cmds: Cmd<Msg>[]) {
    cmds.map((cmd) => cmd(program));
  }

  function applyMsg(msg: Msg) {
    const [newModel, cmds] = config.update(msg, model);
    model = newModel;
    const reactElement = React.createElement(config.view, model);
    root.render(reactElement);
    runCmds(cmds);
    //const subscriptions = config.subscriptions(model);
    //applySubs(subscriptions);
  }

  const reactElement = React.createElement(config.view, program.model);
  root.render(reactElement);
  runCmds(cmds);
  //const subscriptions = config.subscriptions(model);
  //applySubs(subscriptions);
  return program;
}

export function cmdOf<Msg>(msg: Msg): Cmd<Msg> {
  return (program) => {
    program.applyMsg(msg);
  };
}

export function cmdOfAsync<Msg>(
  asyncComputation: () => Promise<Msg>
): Cmd<Msg> {
  return (program) => {
    asyncComputation().then(program.applyMsg);
  };
}
