var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
var __exportStar = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  return __exportStar(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? {get: () => module2.default, enumerable: true} : {value: module2, enumerable: true})), module2);
};

// src/index.ts
__markAsModule(exports);
__export(exports, {
  ApolloClients: () => ApolloClients,
  DefaultApolloClient: () => DefaultApolloClient,
  provideApolloClient: () => provideApolloClient,
  provideApolloClients: () => provideApolloClients,
  useApolloClient: () => useApolloClient,
  useGlobalMutationLoading: () => useGlobalMutationLoading,
  useGlobalQueryLoading: () => useGlobalQueryLoading,
  useGlobalSubscriptionLoading: () => useGlobalSubscriptionLoading,
  useLazyQuery: () => useLazyQuery,
  useMutation: () => useMutation,
  useMutationLoading: () => useMutationLoading,
  useQuery: () => useQuery,
  useQueryLoading: () => useQueryLoading,
  useResult: () => useResult,
  useSubscription: () => useSubscription,
  useSubscriptionLoading: () => useSubscriptionLoading
});

// src/useQuery.ts
var import_vue_demi5 = __toModule(require("vue-demi"));
var import_throttle_debounce = __toModule(require("throttle-debounce"));

// src/useApolloClient.ts
var import_vue_demi = __toModule(require("vue-demi"));
var DefaultApolloClient = Symbol("default-apollo-client");
var ApolloClients = Symbol("apollo-clients");
function resolveDefaultClient(providedApolloClients, providedApolloClient) {
  const resolvedClient = providedApolloClients ? providedApolloClients.default : providedApolloClient != null ? providedApolloClient : void 0;
  return resolvedClient;
}
function resolveClientWithId(providedApolloClients, clientId) {
  if (!providedApolloClients) {
    throw new Error(`No apolloClients injection found, tried to resolve '${clientId}' clientId`);
  }
  return providedApolloClients[clientId];
}
function useApolloClient(clientId) {
  let resolveImpl;
  const savedCurrentClients = currentApolloClients;
  if (!(0, import_vue_demi.getCurrentInstance)()) {
    resolveImpl = (id) => {
      if (id) {
        return resolveClientWithId(savedCurrentClients, id);
      }
      return resolveDefaultClient(savedCurrentClients, savedCurrentClients.default);
    };
  } else {
    const providedApolloClients = (0, import_vue_demi.inject)(ApolloClients, null);
    const providedApolloClient = (0, import_vue_demi.inject)(DefaultApolloClient, null);
    resolveImpl = (id) => {
      if (id) {
        const client2 = resolveClientWithId(providedApolloClients, id);
        if (client2) {
          return client2;
        }
        return resolveClientWithId(savedCurrentClients, id);
      }
      const client = resolveDefaultClient(providedApolloClients, providedApolloClient);
      if (client) {
        return client;
      }
      return resolveDefaultClient(savedCurrentClients, savedCurrentClients.default);
    };
  }
  function resolveClient(id = clientId) {
    const client = resolveImpl(id);
    if (!client) {
      throw new Error(`Apollo client with id ${id != null ? id : "default"} not found. Use provideApolloClient() if you are outside of a component setup.`);
    }
    return client;
  }
  return {
    resolveClient,
    get client() {
      return resolveClient();
    }
  };
}
var currentApolloClients = {};
function provideApolloClient(client) {
  currentApolloClients = {
    default: client
  };
  return function(fn) {
    const result = fn();
    currentApolloClients = {};
    return result;
  };
}
function provideApolloClients(clients) {
  currentApolloClients = clients;
  return function(fn) {
    const result = fn();
    currentApolloClients = {};
    return result;
  };
}

// src/util/paramToRef.ts
var import_vue_demi2 = __toModule(require("vue-demi"));
function paramToRef(param) {
  if ((0, import_vue_demi2.isRef)(param)) {
    return param;
  } else if (typeof param === "function") {
    return (0, import_vue_demi2.computed)(param);
  } else {
    return (0, import_vue_demi2.ref)(param);
  }
}

// src/util/paramToReactive.ts
var import_vue_demi3 = __toModule(require("vue-demi"));
function paramToReactive(param) {
  if ((0, import_vue_demi3.isRef)(param)) {
    return param;
  } else if (typeof param === "function") {
    return (0, import_vue_demi3.computed)(param);
  } else if (param) {
    return (0, import_vue_demi3.reactive)(param);
  } else {
    return param;
  }
}

// src/util/useEventHook.ts
function useEventHook() {
  const fns = [];
  function on(fn) {
    fns.push(fn);
    return {
      off: () => off(fn)
    };
  }
  function off(fn) {
    const index = fns.indexOf(fn);
    if (index !== -1) {
      fns.splice(index, 1);
    }
  }
  function trigger(param) {
    for (const fn of fns) {
      fn(param);
    }
  }
  function getCount() {
    return fns.length;
  }
  return {
    on,
    off,
    trigger,
    getCount
  };
}

// src/util/loadingTracking.ts
var import_vue_demi4 = __toModule(require("vue-demi"));
function getAppTracking() {
  var _a;
  const vm = (0, import_vue_demi4.getCurrentInstance)();
  const root = (_a = vm == null ? void 0 : vm.$root) != null ? _a : vm == null ? void 0 : vm.root;
  if (!root) {
    throw new Error("Instance $root not found");
  }
  let appTracking;
  if (!root._apolloAppTracking) {
    appTracking = root._apolloAppTracking = {
      queries: (0, import_vue_demi4.ref)(0),
      mutations: (0, import_vue_demi4.ref)(0),
      subscriptions: (0, import_vue_demi4.ref)(0),
      components: new Map()
    };
  } else {
    appTracking = root._apolloAppTracking;
  }
  return {
    appTracking
  };
}
function getCurrentTracking() {
  const vm = (0, import_vue_demi4.getCurrentInstance)();
  if (!vm) {
    throw new Error("getCurrentTracking must be used during a component setup");
  }
  const {appTracking} = getAppTracking();
  let tracking;
  if (!appTracking.components.has(vm)) {
    appTracking.components.set(vm, tracking = {
      queries: (0, import_vue_demi4.ref)(0),
      mutations: (0, import_vue_demi4.ref)(0),
      subscriptions: (0, import_vue_demi4.ref)(0)
    });
    (0, import_vue_demi4.onUnmounted)(() => {
      appTracking.components.delete(vm);
    });
  } else {
    tracking = appTracking.components.get(vm);
  }
  return {
    appTracking,
    tracking
  };
}
function track(loading, type) {
  const {appTracking, tracking} = getCurrentTracking();
  (0, import_vue_demi4.watch)(loading, (value, oldValue) => {
    if (oldValue != null && value !== oldValue) {
      const mod = value ? 1 : -1;
      tracking[type].value += mod;
      appTracking[type].value += mod;
    }
  }, {
    immediate: true
  });
  (0, import_vue_demi4.onBeforeUnmount)(() => {
    if (loading.value) {
      tracking[type].value--;
      appTracking[type].value--;
    }
  });
}
function trackQuery(loading) {
  track(loading, "queries");
}
function trackMutation(loading) {
  track(loading, "mutations");
}
function trackSubscription(loading) {
  track(loading, "subscriptions");
}

// src/util/toApolloError.ts
var import_core = __toModule(require("@apollo/client/core"));
function toApolloError(error) {
  if (!(error instanceof Error)) {
    return new import_core.ApolloError({
      networkError: Object.assign(new Error(), {originalError: error}),
      errorMessage: String(error)
    });
  }
  if ((0, import_core.isApolloError)(error)) {
    return error;
  }
  return new import_core.ApolloError({networkError: error, errorMessage: error.message});
}
function resultErrorsToApolloError(errors) {
  return new import_core.ApolloError({
    graphQLErrors: errors,
    errorMessage: `GraphQL response contains errors: ${errors.map((e) => e.message).join(" | ")}`
  });
}

// src/util/env.ts
var isServer = typeof window === "undefined";

// src/useQuery.ts
function useQuery(document, variables, options) {
  return useQueryImpl(document, variables, options);
}
function useQueryImpl(document, variables, options = {}, lazy = false) {
  var _a;
  const vm = (0, import_vue_demi5.getCurrentInstance)();
  const currentOptions = (0, import_vue_demi5.ref)();
  const documentRef = paramToRef(document);
  const variablesRef = paramToRef(variables);
  const optionsRef = paramToReactive(options);
  const result = (0, import_vue_demi5.ref)();
  const resultEvent = useEventHook();
  const error = (0, import_vue_demi5.ref)(null);
  const errorEvent = useEventHook();
  const loading = (0, import_vue_demi5.ref)(false);
  vm && trackQuery(loading);
  const networkStatus = (0, import_vue_demi5.ref)();
  let firstResolve;
  let firstReject;
  vm && ((_a = import_vue_demi5.onServerPrefetch) == null ? void 0 : _a(() => {
    var _a2;
    if (!isEnabled.value || isServer && ((_a2 = currentOptions.value) == null ? void 0 : _a2.prefetch) === false)
      return;
    return new Promise((resolve, reject) => {
      firstResolve = () => {
        resolve();
        firstResolve = void 0;
        firstReject = void 0;
      };
      firstReject = (apolloError) => {
        reject(apolloError);
        firstResolve = void 0;
        firstReject = void 0;
      };
    }).then(stop).catch(stop);
  }));
  const {resolveClient} = useApolloClient();
  const query = (0, import_vue_demi5.ref)();
  let observer;
  let started = false;
  function start() {
    var _a2, _b, _c, _d, _e;
    if (started || !isEnabled.value || isServer && ((_a2 = currentOptions.value) == null ? void 0 : _a2.prefetch) === false) {
      if (firstResolve)
        firstResolve();
      return;
    }
    started = true;
    error.value = null;
    loading.value = true;
    const client = resolveClient((_b = currentOptions.value) == null ? void 0 : _b.clientId);
    query.value = client.watchQuery({
      query: currentDocument,
      variables: currentVariables,
      ...currentOptions.value,
      ...isServer && ((_c = currentOptions.value) == null ? void 0 : _c.fetchPolicy) !== "no-cache" ? {
        fetchPolicy: "network-only"
      } : {}
    });
    startQuerySubscription();
    if (!isServer && (((_d = currentOptions.value) == null ? void 0 : _d.fetchPolicy) !== "no-cache" || currentOptions.value.notifyOnNetworkStatusChange)) {
      const currentResult = query.value.getCurrentResult();
      if (!currentResult.loading || currentResult.partial || ((_e = currentOptions.value) == null ? void 0 : _e.notifyOnNetworkStatusChange)) {
        onNextResult(currentResult);
      }
    }
    if (!isServer) {
      for (const item of subscribeToMoreItems) {
        addSubscribeToMore(item);
      }
    }
  }
  function startQuerySubscription() {
    if (observer && !observer.closed)
      return;
    if (!query.value)
      return;
    observer = query.value.subscribe({
      next: onNextResult,
      error: onError
    });
  }
  function onNextResult(queryResult) {
    var _a2;
    error.value = null;
    processNextResult(queryResult);
    if (!queryResult.error && ((_a2 = queryResult.errors) == null ? void 0 : _a2.length)) {
      processError(resultErrorsToApolloError(queryResult.errors));
    }
    if (firstResolve) {
      firstResolve();
      stop();
    }
  }
  function processNextResult(queryResult) {
    result.value = queryResult.data && Object.keys(queryResult.data).length === 0 ? void 0 : queryResult.data;
    loading.value = queryResult.loading;
    networkStatus.value = queryResult.networkStatus;
    resultEvent.trigger(queryResult);
  }
  function onError(queryError) {
    var _a2, _b, _c, _d;
    const apolloError = toApolloError(queryError);
    const client = resolveClient((_a2 = currentOptions.value) == null ? void 0 : _a2.clientId);
    const errorPolicy = ((_b = currentOptions.value) == null ? void 0 : _b.errorPolicy) || ((_d = (_c = client.defaultOptions) == null ? void 0 : _c.watchQuery) == null ? void 0 : _d.errorPolicy);
    if (errorPolicy && errorPolicy !== "none") {
      processNextResult(query.value.getCurrentResult());
    }
    processError(apolloError);
    if (firstReject) {
      firstReject(apolloError);
      stop();
    }
    resubscribeToQuery();
  }
  function processError(apolloError) {
    error.value = apolloError;
    loading.value = false;
    networkStatus.value = 8;
    errorEvent.trigger(apolloError);
  }
  function resubscribeToQuery() {
    if (!query.value)
      return;
    const lastError = query.value.getLastError();
    const lastResult = query.value.getLastResult();
    query.value.resetLastResults();
    startQuerySubscription();
    Object.assign(query.value, {lastError, lastResult});
  }
  let onStopHandlers = [];
  function stop() {
    if (firstResolve)
      firstResolve();
    if (!started)
      return;
    started = false;
    loading.value = false;
    onStopHandlers.forEach((handler) => handler());
    onStopHandlers = [];
    if (query.value) {
      query.value.stopPolling();
      query.value = null;
    }
    if (observer) {
      observer.unsubscribe();
      observer = void 0;
    }
  }
  let restarting = false;
  function baseRestart() {
    if (!started || restarting)
      return;
    restarting = true;
    (0, import_vue_demi5.nextTick)(() => {
      if (started) {
        stop();
        start();
      }
      restarting = false;
    });
  }
  let debouncedRestart;
  let isRestartDebounceSetup = false;
  function updateRestartFn() {
    var _a2, _b;
    if (!currentOptions.value) {
      debouncedRestart = baseRestart;
    } else {
      if ((_a2 = currentOptions.value) == null ? void 0 : _a2.throttle) {
        debouncedRestart = (0, import_throttle_debounce.throttle)(currentOptions.value.throttle, baseRestart);
      } else if ((_b = currentOptions.value) == null ? void 0 : _b.debounce) {
        debouncedRestart = (0, import_throttle_debounce.debounce)(currentOptions.value.debounce, baseRestart);
      } else {
        debouncedRestart = baseRestart;
      }
      isRestartDebounceSetup = true;
    }
  }
  function restart() {
    if (!isRestartDebounceSetup)
      updateRestartFn();
    debouncedRestart();
  }
  let currentDocument;
  (0, import_vue_demi5.watch)(documentRef, (value) => {
    currentDocument = value;
    restart();
  }, {
    immediate: true
  });
  let currentVariables;
  let currentVariablesSerialized;
  (0, import_vue_demi5.watch)(variablesRef, (value, oldValue) => {
    const serialized = JSON.stringify(value);
    if (serialized !== currentVariablesSerialized) {
      currentVariables = value;
      restart();
    }
    currentVariablesSerialized = serialized;
  }, {
    deep: true,
    immediate: true
  });
  (0, import_vue_demi5.watch)(() => (0, import_vue_demi5.unref)(optionsRef), (value) => {
    if (currentOptions.value && (currentOptions.value.throttle !== value.throttle || currentOptions.value.debounce !== value.debounce)) {
      updateRestartFn();
    }
    currentOptions.value = value;
    restart();
  }, {
    deep: true,
    immediate: true
  });
  function refetch(variables2 = void 0) {
    if (query.value) {
      if (variables2) {
        currentVariables = variables2;
      }
      error.value = null;
      loading.value = true;
      return query.value.refetch(variables2).then((refetchResult) => {
        var _a2;
        const currentResult = (_a2 = query.value) == null ? void 0 : _a2.getCurrentResult();
        currentResult && processNextResult(currentResult);
        return refetchResult;
      });
    }
  }
  function fetchMore(options2) {
    if (query.value) {
      error.value = null;
      loading.value = true;
      return query.value.fetchMore(options2).then((fetchMoreResult) => {
        var _a2;
        const currentResult = (_a2 = query.value) == null ? void 0 : _a2.getCurrentResult();
        currentResult && processNextResult(currentResult);
        return fetchMoreResult;
      });
    }
  }
  const subscribeToMoreItems = [];
  function subscribeToMore(options2) {
    if (isServer)
      return;
    const optionsRef2 = paramToRef(options2);
    (0, import_vue_demi5.watch)(optionsRef2, (value, oldValue, onCleanup) => {
      const index = subscribeToMoreItems.findIndex((item2) => item2.options === oldValue);
      if (index !== -1) {
        subscribeToMoreItems.splice(index, 1);
      }
      const item = {
        options: value,
        unsubscribeFns: []
      };
      subscribeToMoreItems.push(item);
      addSubscribeToMore(item);
      onCleanup(() => {
        item.unsubscribeFns.forEach((fn) => fn());
        item.unsubscribeFns = [];
      });
    }, {
      immediate: true
    });
  }
  function addSubscribeToMore(item) {
    if (!started)
      return;
    if (!query.value) {
      throw new Error("Query is not defined");
    }
    const unsubscribe = query.value.subscribeToMore(item.options);
    onStopHandlers.push(unsubscribe);
    item.unsubscribeFns.push(unsubscribe);
  }
  const forceDisabled = (0, import_vue_demi5.ref)(lazy);
  const enabledOption = (0, import_vue_demi5.computed)(() => !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled);
  const isEnabled = (0, import_vue_demi5.computed)(() => enabledOption.value && !forceDisabled.value);
  (0, import_vue_demi5.watch)(isEnabled, (value) => {
    if (value) {
      start();
    } else {
      stop();
    }
  }, {
    immediate: true
  });
  vm && (0, import_vue_demi5.onBeforeUnmount)(() => {
    stop();
    subscribeToMoreItems.length = 0;
  });
  return {
    result,
    loading,
    networkStatus,
    error,
    start,
    stop,
    restart,
    forceDisabled,
    document: documentRef,
    variables: variablesRef,
    options: optionsRef,
    query,
    refetch,
    fetchMore,
    subscribeToMore,
    onResult: resultEvent.on,
    onError: errorEvent.on
  };
}

// src/useLazyQuery.ts
var import_vue_demi6 = __toModule(require("vue-demi"));
function useLazyQuery(document, variables, options) {
  const query = useQueryImpl(document, variables, options, true);
  function load(document2, variables2, options2) {
    if (document2) {
      query.document.value = document2;
    }
    if (variables2) {
      query.variables.value = variables2;
    }
    if (options2) {
      Object.assign((0, import_vue_demi6.isRef)(query.options) ? query.options.value : query.options, options2);
    }
    query.forceDisabled.value = false;
  }
  return {
    ...query,
    load
  };
}

// src/useMutation.ts
var import_vue_demi7 = __toModule(require("vue-demi"));
function useMutation(document, options = {}) {
  const vm = (0, import_vue_demi7.getCurrentInstance)();
  const loading = (0, import_vue_demi7.ref)(false);
  vm && trackMutation(loading);
  const error = (0, import_vue_demi7.ref)(null);
  const called = (0, import_vue_demi7.ref)(false);
  const doneEvent = useEventHook();
  const errorEvent = useEventHook();
  const {resolveClient} = useApolloClient();
  async function mutate(variables, overrideOptions = {}) {
    let currentDocument;
    if (typeof document === "function") {
      currentDocument = document();
    } else if ((0, import_vue_demi7.isRef)(document)) {
      currentDocument = document.value;
    } else {
      currentDocument = document;
    }
    let currentOptions;
    if (typeof options === "function") {
      currentOptions = options();
    } else if ((0, import_vue_demi7.isRef)(options)) {
      currentOptions = options.value;
    } else {
      currentOptions = options;
    }
    const client = resolveClient(currentOptions.clientId);
    error.value = null;
    loading.value = true;
    called.value = true;
    try {
      const result = await client.mutate({
        mutation: currentDocument,
        ...currentOptions,
        ...overrideOptions,
        variables: (variables != null ? variables : currentOptions.variables) ? {
          ...currentOptions.variables,
          ...variables
        } : void 0
      });
      loading.value = false;
      doneEvent.trigger(result);
      return result;
    } catch (e) {
      const apolloError = toApolloError(e);
      error.value = apolloError;
      loading.value = false;
      errorEvent.trigger(apolloError);
      if (currentOptions.throws === "always" || currentOptions.throws !== "never" && !errorEvent.getCount()) {
        throw apolloError;
      }
    }
    return null;
  }
  vm && (0, import_vue_demi7.onBeforeUnmount)(() => {
    loading.value = false;
  });
  return {
    mutate,
    loading,
    error,
    called,
    onDone: doneEvent.on,
    onError: errorEvent.on
  };
}

// src/useSubscription.ts
var import_vue_demi8 = __toModule(require("vue-demi"));
var import_throttle_debounce2 = __toModule(require("throttle-debounce"));
function useSubscription(document, variables = void 0, options = {}) {
  const vm = (0, import_vue_demi8.getCurrentInstance)();
  const documentRef = paramToRef(document);
  const variablesRef = paramToRef(variables);
  const optionsRef = paramToReactive(options);
  const result = (0, import_vue_demi8.ref)();
  const resultEvent = useEventHook();
  const error = (0, import_vue_demi8.ref)(null);
  const errorEvent = useEventHook();
  const loading = (0, import_vue_demi8.ref)(false);
  vm && trackSubscription(loading);
  const {resolveClient} = useApolloClient();
  const subscription = (0, import_vue_demi8.ref)(null);
  let observer = null;
  let started = false;
  function start() {
    var _a;
    if (started || !isEnabled.value || isServer)
      return;
    started = true;
    loading.value = true;
    const client = resolveClient((_a = currentOptions.value) == null ? void 0 : _a.clientId);
    subscription.value = client.subscribe({
      query: currentDocument,
      variables: currentVariables,
      ...currentOptions.value
    });
    observer = subscription.value.subscribe({
      next: onNextResult,
      error: onError
    });
  }
  function onNextResult(fetchResult) {
    result.value = fetchResult.data;
    loading.value = false;
    resultEvent.trigger(fetchResult);
  }
  function onError(fetchError) {
    const apolloError = toApolloError(fetchError);
    error.value = apolloError;
    loading.value = false;
    errorEvent.trigger(apolloError);
  }
  function stop() {
    if (!started)
      return;
    started = false;
    loading.value = false;
    if (subscription.value) {
      subscription.value = null;
    }
    if (observer) {
      observer.unsubscribe();
      observer = null;
    }
  }
  let restarting = false;
  function baseRestart() {
    if (!started || restarting)
      return;
    restarting = true;
    (0, import_vue_demi8.nextTick)(() => {
      if (started) {
        stop();
        start();
      }
      restarting = false;
    });
  }
  let debouncedRestart;
  function updateRestartFn() {
    var _a, _b;
    if ((_a = currentOptions.value) == null ? void 0 : _a.throttle) {
      debouncedRestart = (0, import_throttle_debounce2.throttle)(currentOptions.value.throttle, baseRestart);
    } else if ((_b = currentOptions.value) == null ? void 0 : _b.debounce) {
      debouncedRestart = (0, import_throttle_debounce2.debounce)(currentOptions.value.debounce, baseRestart);
    } else {
      debouncedRestart = baseRestart;
    }
  }
  function restart() {
    if (!debouncedRestart)
      updateRestartFn();
    debouncedRestart();
  }
  const currentOptions = (0, import_vue_demi8.ref)();
  (0, import_vue_demi8.watch)(() => (0, import_vue_demi8.isRef)(optionsRef) ? optionsRef.value : optionsRef, (value) => {
    if (currentOptions.value && (currentOptions.value.throttle !== value.throttle || currentOptions.value.debounce !== value.debounce)) {
      updateRestartFn();
    }
    currentOptions.value = value;
    restart();
  }, {
    deep: true,
    immediate: true
  });
  let currentDocument;
  (0, import_vue_demi8.watch)(documentRef, (value) => {
    currentDocument = value;
    restart();
  }, {
    immediate: true
  });
  let currentVariables;
  let currentVariablesSerialized;
  (0, import_vue_demi8.watch)(variablesRef, (value, oldValue) => {
    const serialized = JSON.stringify(value);
    if (serialized !== currentVariablesSerialized) {
      currentVariables = value;
      restart();
    }
    currentVariablesSerialized = serialized;
  }, {
    deep: true,
    immediate: true
  });
  const enabledOption = (0, import_vue_demi8.computed)(() => !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled);
  const isEnabled = enabledOption;
  (0, import_vue_demi8.watch)(isEnabled, (value) => {
    if (value) {
      start();
    } else {
      stop();
    }
  }, {
    immediate: true
  });
  vm && (0, import_vue_demi8.onBeforeUnmount)(stop);
  return {
    result,
    loading,
    error,
    start,
    stop,
    restart,
    document: documentRef,
    variables: variablesRef,
    options: optionsRef,
    subscription,
    onResult: resultEvent.on,
    onError: errorEvent.on
  };
}

// src/useResult.ts
var import_vue_demi9 = __toModule(require("vue-demi"));
function useResult(result, defaultValue, pick) {
  console.warn(`'useResult' is deprecated and will be removed soon. Plase use a computed instead.
Before:
const items = useResult(result, [], data => data.someField.myItems)
After:
const items = computed(() => result.value?.someField.myItems ?? [])`);
  return (0, import_vue_demi9.computed)(() => {
    const value = result.value;
    if (value) {
      if (pick) {
        try {
          return pick(value);
        } catch (e) {
        }
      } else {
        const keys = Object.keys(value);
        if (keys.length === 1) {
          return value[keys[0]];
        } else {
          return value;
        }
      }
    }
    return defaultValue;
  });
}

// src/useLoading.ts
var import_vue_demi10 = __toModule(require("vue-demi"));
function useQueryLoading() {
  const {tracking} = getCurrentTracking();
  return (0, import_vue_demi10.computed)(() => tracking.queries.value > 0);
}
function useMutationLoading() {
  const {tracking} = getCurrentTracking();
  return (0, import_vue_demi10.computed)(() => tracking.mutations.value > 0);
}
function useSubscriptionLoading() {
  const {tracking} = getCurrentTracking();
  return (0, import_vue_demi10.computed)(() => tracking.subscriptions.value > 0);
}
function useGlobalQueryLoading() {
  const {appTracking} = getAppTracking();
  return (0, import_vue_demi10.computed)(() => appTracking.queries.value > 0);
}
function useGlobalMutationLoading() {
  const {appTracking} = getAppTracking();
  return (0, import_vue_demi10.computed)(() => appTracking.mutations.value > 0);
}
function useGlobalSubscriptionLoading() {
  const {appTracking} = getAppTracking();
  return (0, import_vue_demi10.computed)(() => appTracking.subscriptions.value > 0);
}
//# sourceMappingURL=index.js.map
