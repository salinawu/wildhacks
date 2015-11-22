# -*- coding: utf-8 -*-
import pandas as pd
import imp, sys
import sqlite3
import mysql.connector
from sqlalchemy import create_engine

#from fooddeserts.models import *

PATH_ROOT = "/home/kzen/repos/wildhacks/"
FILE_PATH_IND = PATH_ROOT+ "data/Nearby_Independent_Cook_County_Grocery_Stores.csv"
FILE_PATH_REG = PATH_ROOT+ "data/Grocery_Stores2013.csv"
FILE_PATH_CHAIN = PATH_ROOT+ "data/Nearby_Cook_County_Grocery_Store_Chains.csv"

DB_FILE = PATH_ROOT+ "db.sqlite3"
#CONFIGS_PATH = PATH_ROOT + "scripts/configs.py"
#configs = imp.load_source("configs", CONFIGS_PATH)

def get_lat_ind(df):
    return float(list(df.split())[0].strip("(,)"))
def get_long_ind(df):
    return float(list(df.split())[1].strip("(,)"))

def get_lat_chain(df):
    last_coord = len(df.split())-2
    return float(df.split()[last_coord:][0].strip("(,)"))

def get_long_chain(df):
    last_coord = len(df.split())-2

    return float(df.split()[last_coord:][1].strip("(,)"))


def add_name(df,name):
    type_list = [name for row in range(0,len(df.index))]
    df["STORE_TYPE"] = pd.Series(type_list,index = df.index)
    return df[["STORE_TYPE","LATITUDE","LONGITUDE"]]

    
#def add_store_helper(store,lat,lon):
#    s = Stores.objects.get_or_create(store_type = store, latitude = lat, longitude = lon )
#    return s
#    
#def add_stores(df):
#    for index,row in df.iterrows():
#        store = row.STORE_TYPE
#        lat = row.LATITUDE
#        lon = row.LONGITUDE
#        add_store_helper(store,lat,lon)
    
    
if __name__ == "__main__":

    # INDEPENDENT STORES
    df_ind = pd.read_csv(FILE_PATH_IND)
    df_ind["LATITUDE"] = df_ind["LOCATION"].apply(func = get_lat_ind)
    df_ind["LONGITUDE"] = df_ind["LOCATION"].apply(func = get_long_ind)
    df_ind = add_name(df_ind,"ind_grocery")

    # REGULAR GROCERY STORES
    df_reg = pd.read_csv(FILE_PATH_REG)
    df_reg = add_name(df_reg,"grocery")

    #CHAIN GROCERY STORES
    df_chain = pd.read_csv(FILE_PATH_CHAIN)
    df_chain["LATITUDE"]= df_chain["LOCATION"].apply(func = get_lat_chain)
    df_chain["LONGITUDE"] = df_chain["LOCATION"].apply(func = get_long_chain)
    df_chain = add_name(df_chain,"chain_grocery")

    col = ["STORE_TYPE","LATITUDE","LONGITUDE"]
    df_final = pd.DataFrame(columns = col)
    df_final = df_final.append(df_ind)
    df_final = df_final.append(df_chain)
    df_final = df_final.append(df_reg)
    df_final = df_final.reset_index(drop = True)
#    print 'sqlite:///'+ DB_FILE

    

    engine = create_engine('sqlite:///'+ DB_FILE)
    c = engine.connect()
    conn = c.connection
    df_final.to_sql("stores", con = conn)


#    add_stores(df_final)    

#    print 'sqlite:///'+ DB_FILE

