<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public  function Login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();
        if (!Auth::attempt($data))
        {
            return response()->json([
                'message' => 'Your credentials are incorrect'
            ], 422);
        }
         /** @var User $user */

        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);

    }
    public function Register(RegisterRequest $request): JsonResponse
    {

        $data = $request->validated();
        /** @var  User $user */
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
    public function Logout(Request $request): JsonResponse
    {

        /** @var  User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response()->json('', 204);
    }
}
