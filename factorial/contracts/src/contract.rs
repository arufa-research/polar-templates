use cosmwasm_std::{
    debug_print, to_binary, Api, Binary, Env, Extern, HandleResponse, InitResponse, Querier,
    StdResult, Storage,
};

use crate::msg::{FactorialResponse, HandleMsg, InitMsg, QueryMsg};
use crate::state::{config, config_read, State};

pub fn init<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: InitMsg,
) -> StdResult<InitResponse> {
    let state = State {
        factorial: msg.factorial,
        owner: deps.api.canonical_address(&env.message.sender)?,
    };

    config(&mut deps.storage).save(&state)?;

    debug_print!("Contract was initialized by {}", env.message.sender);

    Ok(InitResponse::default())
}

pub fn handle<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: HandleMsg,
) -> StdResult<HandleResponse> {
    match msg {
        HandleMsg::Factorial { number } => try_factorial(deps, env, number),
    }
}

pub fn try_factorial<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    _env: Env,
    number: i32,
) -> StdResult<HandleResponse> {
    config(&mut deps.storage).update(|mut state| {
        if number == 0 {
            state.factorial = 1;
        }

        let mut result = 1;
        let mut x = 1;
        while x <= number {
            result *= x;
            x += 1;
        }

        state.factorial = result;
        Ok(state)
    })?;
    debug_print("factorial stored successfully");
    Ok(HandleResponse::default())
}

pub fn query<S: Storage, A: Api, Q: Querier>(
    deps: &Extern<S, A, Q>,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetFactorial {} => to_binary(&query_factorial(deps)?),
    }
}

fn query_factorial<S: Storage, A: Api, Q: Querier>(deps: &Extern<S, A, Q>) -> StdResult<FactorialResponse> {
    let state = config_read(&deps.storage).load()?;
    Ok(FactorialResponse { factorial: state.factorial })
}

#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::{mock_dependencies, mock_env};
    use cosmwasm_std::{coins, from_binary};

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies(20, &[]);

        let msg = InitMsg { factorial: 1 };
        let env = mock_env("creator", &coins(1000, "earth"));

        // we can just call .unwrap() to assert this was a success
        let res = init(&mut deps, env, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(&deps, QueryMsg::GetFactorial {}).unwrap();
        let value: FactorialResponse = from_binary(&res).unwrap();
        assert_eq!(1, value.factorial);
    }

    #[test]
    fn factorial() {
        let mut deps = mock_dependencies(20, &coins(2, "token"));

        let msg = InitMsg { factorial: 1 };
        let env = mock_env("creator", &coins(2, "token"));
        let _res = init(&mut deps, env, msg).unwrap();

        // anyone can call factorial
        let env = mock_env("anyone", &coins(2, "token"));
        let msg = HandleMsg::Factorial { number: 5 };
        let _res = handle(&mut deps, env, msg).unwrap();

        // should save factorial of 5
        let res = query(&deps, QueryMsg::GetFactorial {}).unwrap();
        let value: FactorialResponse = from_binary(&res).unwrap();
        assert_eq!(120, value.factorial);
    }
}
